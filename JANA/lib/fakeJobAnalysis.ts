import { fakeJobCsv } from "@/lib/fakeJobData";

export type DataRow = Record<string, string | number>;

export type CleaningStep = {
  name: string;
  detail: string;
  impact: string;
};

export type CleanedDataset = {
  rawHeaders: string[];
  normalizedHeaders: string[];
  rawRows: DataRow[];
  cleanedRows: DataRow[];
  duplicateRowsRemoved: number;
  missingBefore: number;
  missingAfter: number;
  fraudRate: number;
  fraudByEmployment: { label: string; fraudRate: number; total: number }[];
  fraudByLogo: { label: string; fraudRate: number; total: number }[];
  industryCounts: { label: string; total: number }[];
  tutorialSteps: CleaningStep[];
};

function normalizeHeader(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^\w]/g, "");
}

function parseCsv(csvText: string) {
  const lines = csvText.trim().split("\n");
  const rawHeaders = splitCsvLine(lines[0]);
  const normalizedHeaders = rawHeaders.map(normalizeHeader);
  const rows = lines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    return Object.fromEntries(normalizedHeaders.map((header, index) => [header, values[index] ?? ""]));
  });
  return { rawHeaders, normalizedHeaders, rows };
}

function splitCsvLine(line: string) {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      cells.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  cells.push(current);
  return cells.map((cell) => cell.trim());
}

function countMissing(rows: DataRow[]) {
  return rows.reduce((total, row) => {
    return (
      total +
      Object.values(row).filter((value) => String(value).trim() === "" || value === "Unknown").length
    );
  }, 0);
}

function toPercent(value: number) {
  return Math.round(value * 100);
}

function groupFraudRate(rows: DataRow[], key: string) {
  const grouped = new Map<string, { frauds: number; total: number }>();

  for (const row of rows) {
    const label = String(row[key] || "unknown");
    const current = grouped.get(label) ?? { frauds: 0, total: 0 };
    current.total += 1;
    current.frauds += Number(row.fraudulent);
    grouped.set(label, current);
  }

  return [...grouped.entries()]
    .map(([label, value]) => ({
      label,
      total: value.total,
      fraudRate: value.total ? value.frauds / value.total : 0,
    }))
    .sort((left, right) => right.fraudRate - left.fraudRate || right.total - left.total);
}

function groupCount(rows: DataRow[], key: string) {
  const grouped = new Map<string, number>();

  for (const row of rows) {
    const label = String(row[key] || "unknown");
    grouped.set(label, (grouped.get(label) ?? 0) + 1);
  }

  return [...grouped.entries()]
    .map(([label, total]) => ({ label, total }))
    .sort((left, right) => right.total - left.total);
}

export function buildFakeJobDataset(): CleanedDataset {
  const parsed = parseCsv(fakeJobCsv);
  const rawRows = parsed.rows;
  const missingBefore = countMissing(rawRows);
  const seenJobIds = new Set<string>();

  const cleanedRows = rawRows
    .filter((row) => {
      const jobId = String(row.job_id);
      if (seenJobIds.has(jobId)) return false;
      seenJobIds.add(jobId);
      return true;
    })
    .map((row) => ({
      ...row,
      department: String(row.department || "").trim() || "unspecified",
      salary_range: String(row.salary_range || "").trim() || "not_listed",
      employment_type: String(row.employment_type || "").trim() || "unknown",
      required_experience: String(row.required_experience || "").trim() || "unspecified",
      telecommuting: Number(row.telecommuting || 0),
      has_company_logo: Number(row.has_company_logo || 0),
      has_questions: Number(row.has_questions || 0),
      fraudulent: Number(row.fraudulent || 0),
    }));

  const duplicateRowsRemoved = rawRows.length - cleanedRows.length;
  const missingAfter = countMissing(cleanedRows);
  const fraudRate =
    cleanedRows.reduce((sum, row) => sum + Number(row.fraudulent), 0) / cleanedRows.length;

  return {
    rawHeaders: parsed.rawHeaders,
    normalizedHeaders: parsed.normalizedHeaders,
    rawRows,
    cleanedRows,
    duplicateRowsRemoved,
    missingBefore,
    missingAfter,
    fraudRate,
    fraudByEmployment: groupFraudRate(cleanedRows, "employment_type"),
    fraudByLogo: groupFraudRate(cleanedRows, "has_company_logo").map((entry) => ({
      ...entry,
      label: entry.label === "1" ? "Logo present" : "Logo missing",
    })),
    industryCounts: groupCount(cleanedRows, "industry").slice(0, 6),
    tutorialSteps: [
      {
        name: "Profile the sheet",
        detail:
          "Read the raw fake job sheet, inspect headers, and identify high-risk columns such as salary, experience, and fraud labels.",
        impact: `${parsed.rawHeaders.length} columns discovered in the incoming sheet.`,
      },
      {
        name: "Normalize and deduplicate",
        detail:
          "Standardize header names to snake_case, trim text, and keep one record per job id so the visuals are not skewed by duplicate postings.",
        impact: `${duplicateRowsRemoved} duplicate row removed.`,
      },
      {
        name: "Repair missing values",
        detail:
          "Replace blank department, salary, employment type, and experience fields with explicit placeholders so missingness is visible and analyzable.",
        impact: `${missingBefore - missingAfter} missing values resolved with deterministic fills.`,
      },
      {
        name: "Visualize fraud patterns",
        detail:
          "Aggregate the cleaned sheet to compare fraud rates across employment type, company logo presence, and industry mix.",
        impact: `${toPercent(fraudRate)}% of cleaned postings are labeled fraudulent.`,
      },
    ],
  };
}

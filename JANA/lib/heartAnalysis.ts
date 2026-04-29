import fs from "node:fs";
import path from "node:path";

export type DataRow = Record<string, string | number>;

export type CleaningStep = {
  name: string;
  detail: string;
  impact: string;
};

type GroupStat = {
  label: string;
  total: number;
  positive: number;
  rate: number;
};

type NumericAverage = {
  label: string;
  value: number;
  unit?: string;
  meta?: string;
};

type HeatmapCell = {
  x: string;
  y: string;
  value: number;
};

export type CleanedHeartRow = {
  age: number;
  sex: number;
  cp: number;
  trestbps: number;
  chol: number;
  fbs: number;
  restecg: number;
  thalach: number;
  exang: number;
  oldpeak: number;
  slope: number;
  ca: number;
  thal: string;
  target: number;
  sexLabel: string;
  chestPainLabel: string;
  exerciseAnginaLabel: string;
  thalLabel: string;
  ageBand: string;
  bpBand: string;
  cholBand: string;
  heartRateBand: string;
  targetLabel: string;
};

export type HeartDataset = {
  rawHeaders: string[];
  normalizedHeaders: string[];
  rawRows: DataRow[];
  cleanedRows: CleanedHeartRow[];
  duplicateRowsRemoved: number;
  missingBefore: number;
  missingAfter: number;
  diagnosisRate: number;
  meanAge: number;
  meanCholesterol: number;
  meanMaxHeartRate: number;
  legacyCategoryFixes: number;
  targetDistribution: GroupStat[];
  sexBreakdown: GroupStat[];
  chestPainBreakdown: GroupStat[];
  exerciseAnginaBreakdown: GroupStat[];
  thalBreakdown: GroupStat[];
  ageBandBreakdown: GroupStat[];
  bloodPressureBreakdown: GroupStat[];
  cholesterolBreakdown: GroupStat[];
  heartRateBreakdown: GroupStat[];
  metricAveragesByTarget: NumericAverage[];
  correlationMatrix: HeatmapCell[];
  strongestSignal: { label: string; value: number };
  tutorialSteps: CleaningStep[];
};

const DATASET_PATH = path.join(process.cwd(), "lib", "heart.csv");

const chestPainLabels: Record<number, string> = {
  0: "Asymptomatic",
  1: "Typical angina",
  2: "Atypical angina",
  3: "Non-anginal pain",
  4: "Asymptomatic",
};

const thalLabels: Record<string, string> = {
  normal: "Normal flow",
  fixed: "Fixed defect",
  reversible: "Reversible defect",
  "1": "Normal flow",
  "2": "Fixed defect",
};

function normalizeHeader(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^\w]/g, "");
}

function parseCsv(csvText: string) {
  const lines = csvText.trim().split(/\r?\n/);
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

function toNumber(value: string | number) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

function countMissing(rows: DataRow[]) {
  return rows.reduce((total, row) => {
    return (
      total +
      Object.values(row).filter((value) => String(value).trim() === "" || String(value).trim() === "?").length
    );
  }, 0);
}

function ageBand(age: number) {
  if (age < 45) return "Under 45";
  if (age < 55) return "45-54";
  if (age < 65) return "55-64";
  return "65+";
}

function bloodPressureBand(value: number) {
  if (value < 120) return "Normal BP";
  if (value < 140) return "Elevated BP";
  return "High BP";
}

function cholesterolBand(value: number) {
  if (value < 200) return "Desirable";
  if (value < 240) return "Borderline high";
  return "High";
}

function heartRateBand(value: number) {
  if (value < 120) return "Low max HR";
  if (value < 150) return "Moderate max HR";
  if (value < 170) return "High max HR";
  return "Very high max HR";
}

function groupDiagnosisRate<T extends Record<string, string | number>>(rows: T[], key: keyof T) {
  const grouped = new Map<string, { total: number; positive: number }>();

  for (const row of rows) {
    const label = String(row[key]);
    const current = grouped.get(label) ?? { total: 0, positive: 0 };
    current.total += 1;
    current.positive += Number(row.target);
    grouped.set(label, current);
  }

  return [...grouped.entries()]
    .map(([label, value]) => ({
      label,
      total: value.total,
      positive: value.positive,
      rate: value.total ? value.positive / value.total : 0,
    }))
    .sort((left, right) => right.rate - left.rate || right.total - left.total);
}

function average(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function round(value: number, digits = 1) {
  return Number(value.toFixed(digits));
}

function correlation(x: number[], y: number[]) {
  const meanX = average(x);
  const meanY = average(y);
  let numerator = 0;
  let left = 0;
  let right = 0;

  for (let index = 0; index < x.length; index += 1) {
    const dx = x[index] - meanX;
    const dy = y[index] - meanY;
    numerator += dx * dy;
    left += dx * dx;
    right += dy * dy;
  }

  if (!left || !right) return 0;
  return numerator / Math.sqrt(left * right);
}

function buildCorrelationMatrix(rows: CleanedHeartRow[]) {
  const metrics = [
    { key: "age", label: "Age" },
    { key: "trestbps", label: "Resting BP" },
    { key: "chol", label: "Cholesterol" },
    { key: "thalach", label: "Max HR" },
    { key: "oldpeak", label: "ST depression" },
    { key: "ca", label: "Major vessels" },
    { key: "target", label: "Diagnosis" },
  ] as const;

  const matrix: HeatmapCell[] = [];

  for (const yMetric of metrics) {
    for (const xMetric of metrics) {
      const x = rows.map((row) => row[xMetric.key]);
      const y = rows.map((row) => row[yMetric.key]);
      matrix.push({
        x: xMetric.label,
        y: yMetric.label,
        value: correlation(x, y),
      });
    }
  }

  return matrix;
}

function cleanRow(row: DataRow): { row: CleanedHeartRow; usedLegacyFix: boolean } {
  const rawThal = String(row.thal).toLowerCase();
  const cleanedThal = thalLabels[rawThal] ?? "Unspecified";
  const usedLegacyFix = rawThal === "1" || rawThal === "2";
  const age = toNumber(row.age);
  const trestbps = toNumber(row.trestbps);
  const chol = toNumber(row.chol);
  const thalach = toNumber(row.thalach);
  const target = toNumber(row.target);
  const sex = toNumber(row.sex);
  const cp = toNumber(row.cp);
  const exang = toNumber(row.exang);

  return {
    row: {
      age,
      sex,
      cp,
      trestbps,
      chol,
      fbs: toNumber(row.fbs),
      restecg: toNumber(row.restecg),
      thalach,
      exang,
      oldpeak: toNumber(row.oldpeak),
      slope: toNumber(row.slope),
      ca: toNumber(row.ca),
      thal: cleanedThal,
      target,
      sexLabel: sex === 1 ? "Male" : "Female",
      chestPainLabel: chestPainLabels[cp] ?? `Code ${cp}`,
      exerciseAnginaLabel: exang === 1 ? "Exercise angina" : "No exercise angina",
      thalLabel: cleanedThal,
      ageBand: ageBand(age),
      bpBand: bloodPressureBand(trestbps),
      cholBand: cholesterolBand(chol),
      heartRateBand: heartRateBand(thalach),
      targetLabel: target === 1 ? "Heart disease" : "No disease",
    },
    usedLegacyFix,
  };
}

export function buildHeartDataset(): HeartDataset {
  const parsed = parseCsv(fs.readFileSync(DATASET_PATH, "utf8"));
  const rawRows = parsed.rows;
  const missingBefore = countMissing(rawRows);
  const seen = new Set<string>();
  let legacyCategoryFixes = 0;

  const cleanedRows = rawRows
    .filter((row) => {
      const signature = parsed.normalizedHeaders.map((header) => String(row[header])).join("|");
      if (seen.has(signature)) return false;
      seen.add(signature);
      return true;
    })
    .map((row) => {
      const cleaned = cleanRow(row);
      if (cleaned.usedLegacyFix) legacyCategoryFixes += 1;
      return cleaned.row;
    });

  const duplicateRowsRemoved = rawRows.length - cleanedRows.length;
  const missingAfter = countMissing(cleanedRows as unknown as DataRow[]);
  const diagnosisRate = average(cleanedRows.map((row) => row.target));
  const correlationMatrix = buildCorrelationMatrix(cleanedRows);
  const strongestSignalCell = correlationMatrix
    .filter((cell) => cell.x === "Diagnosis" && cell.y !== "Diagnosis")
    .sort((left, right) => Math.abs(right.value) - Math.abs(left.value))[0];

  return {
    rawHeaders: parsed.rawHeaders,
    normalizedHeaders: parsed.normalizedHeaders,
    rawRows,
    cleanedRows,
    duplicateRowsRemoved,
    missingBefore,
    missingAfter,
    diagnosisRate,
    meanAge: round(average(cleanedRows.map((row) => row.age))),
    meanCholesterol: round(average(cleanedRows.map((row) => row.chol))),
    meanMaxHeartRate: round(average(cleanedRows.map((row) => row.thalach))),
    legacyCategoryFixes,
    targetDistribution: groupDiagnosisRate(cleanedRows, "targetLabel"),
    sexBreakdown: groupDiagnosisRate(cleanedRows, "sexLabel"),
    chestPainBreakdown: groupDiagnosisRate(cleanedRows, "chestPainLabel"),
    exerciseAnginaBreakdown: groupDiagnosisRate(cleanedRows, "exerciseAnginaLabel"),
    thalBreakdown: groupDiagnosisRate(cleanedRows, "thalLabel"),
    ageBandBreakdown: groupDiagnosisRate(cleanedRows, "ageBand"),
    bloodPressureBreakdown: groupDiagnosisRate(cleanedRows, "bpBand"),
    cholesterolBreakdown: groupDiagnosisRate(cleanedRows, "cholBand"),
    heartRateBreakdown: groupDiagnosisRate(cleanedRows, "heartRateBand"),
    metricAveragesByTarget: [
      {
        label: "Age gap",
        value:
          round(
            average(cleanedRows.filter((row) => row.target === 1).map((row) => row.age)) -
              average(cleanedRows.filter((row) => row.target === 0).map((row) => row.age)),
          ),
        unit: " yrs",
        meta: "disease minus no-disease",
      },
      {
        label: "Resting BP gap",
        value:
          round(
            average(cleanedRows.filter((row) => row.target === 1).map((row) => row.trestbps)) -
              average(cleanedRows.filter((row) => row.target === 0).map((row) => row.trestbps)),
          ),
        unit: " mmHg",
        meta: "disease minus no-disease",
      },
      {
        label: "Cholesterol gap",
        value:
          round(
            average(cleanedRows.filter((row) => row.target === 1).map((row) => row.chol)) -
              average(cleanedRows.filter((row) => row.target === 0).map((row) => row.chol)),
          ),
        unit: " mg/dL",
        meta: "disease minus no-disease",
      },
      {
        label: "Max HR gap",
        value:
          round(
            average(cleanedRows.filter((row) => row.target === 1).map((row) => row.thalach)) -
              average(cleanedRows.filter((row) => row.target === 0).map((row) => row.thalach)),
          ),
        unit: " bpm",
        meta: "disease minus no-disease",
      },
    ],
    correlationMatrix,
    strongestSignal: {
      label: strongestSignalCell?.y ?? "n/a",
      value: strongestSignalCell ? round(strongestSignalCell.value, 2) : 0,
    },
    tutorialSteps: [
      {
        name: "Load the Kaggle sheet",
        detail:
          "Read the 303-row heart disease CSV, validate the 14 expected columns, and keep the raw schema visible for notebook inspection.",
        impact: `${rawRows.length} patient records loaded from the local CSV.`,
      },
      {
        name: "Normalize categorical drift",
        detail:
          "Coerce numeric columns, remove duplicate records if they appear, and harmonize mixed thal encodings so one label does not split into multiple tiny categories.",
        impact: `${legacyCategoryFixes} legacy category rows repaired.`,
      },
      {
        name: "Bucket clinical ranges",
        detail:
          "Create age, blood pressure, cholesterol, and max-heart-rate bands to mirror the exploratory grouping used in heart disease notebook walkthroughs.",
        impact: `${parsed.normalizedHeaders.length} columns kept and 4 clinical band features derived.`,
      },
      {
        name: "Profile diagnosis signals",
        detail:
          "Aggregate diagnosis rate by sex, chest pain, exercise-induced angina, thal status, and correlation strength to drive the visualization gallery.",
        impact: `${round(diagnosisRate * 100)}% of rows are labeled positive for heart disease.`,
      },
    ],
  };
}

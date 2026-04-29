import Link from "next/link";
import { BarChart } from "@/components/BarChart";
import { DataTable } from "@/components/DataTable";
import { TutorialTimeline } from "@/components/TutorialTimeline";
import { UrlPanel } from "@/components/UrlPanel";
import { buildFakeJobDataset } from "@/lib/fakeJobAnalysis";

const dataset = buildFakeJobDataset();

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero panel">
        <div>
          <p className="eyebrow">Notebook Cleaning and Visualization Web App</p>
          <h1>Fake job posting data, cleaned and explained in a Next.js notebook-style workflow.</h1>
          <p className="hero-copy">
            This web app uses a built-in fake job sheet to show how a messy tabular dataset is
            profiled, cleaned, and converted into visual fraud signals. The tutorial route explains
            each transformation step in notebook language.
          </p>
          <div className="hero-actions">
            <Link href="/tutorial" className="action primary">
              Open NB Tutorial
            </Link>
            <a href="#visuals" className="action secondary">
              Jump to Visuals
            </a>
          </div>
        </div>
        <div className="metric-grid">
          <article className="metric-card">
            <span>Raw rows</span>
            <strong>{dataset.rawRows.length}</strong>
          </article>
          <article className="metric-card">
            <span>Cleaned rows</span>
            <strong>{dataset.cleanedRows.length}</strong>
          </article>
          <article className="metric-card">
            <span>Fraud rate</span>
            <strong>{Math.round(dataset.fraudRate * 100)}%</strong>
          </article>
          <article className="metric-card">
            <span>Duplicates removed</span>
            <strong>{dataset.duplicateRowsRemoved}</strong>
          </article>
        </div>
      </section>

      <UrlPanel />

      <TutorialTimeline steps={dataset.tutorialSteps} />

      <section className="panel section-grid">
        <div className="section-head">
          <div>
            <p className="eyebrow">Cleaning Audit</p>
            <h2>Before and after snapshots of the fake job sheet.</h2>
          </div>
          <div className="audit-chip-row">
            <span className="chip">Missing before: {dataset.missingBefore}</span>
            <span className="chip">Missing after: {dataset.missingAfter}</span>
            <span className="chip">
              Headers normalized: {dataset.normalizedHeaders.slice(0, 4).join(", ")}...
            </span>
          </div>
        </div>
        <div className="table-grid">
          <DataTable
            title="Raw sheet preview"
            columns={["job_id", "title", "department", "salary_range", "employment_type", "fraudulent"]}
            rows={dataset.rawRows.slice(0, 6)}
          />
          <DataTable
            title="Cleaned sheet preview"
            columns={["job_id", "title", "department", "salary_range", "employment_type", "fraudulent"]}
            rows={dataset.cleanedRows.slice(0, 6)}
          />
        </div>
      </section>

      <section id="visuals" className="panel section-grid">
        <div className="section-head">
          <div>
            <p className="eyebrow">Visualization Studio</p>
            <h2>Simple charts that expose fraud patterns after cleaning.</h2>
          </div>
        </div>
        <div className="chart-grid">
          <BarChart
            title="Fraud rate by employment type"
            data={dataset.fraudByEmployment.map((item) => ({
              label: item.label,
              value: Math.round(item.fraudRate * 100),
              suffix: "%",
              meta: `${item.total} postings`,
            }))}
          />
          <BarChart
            title="Fraud rate by company logo signal"
            data={dataset.fraudByLogo.map((item) => ({
              label: item.label,
              value: Math.round(item.fraudRate * 100),
              suffix: "%",
              meta: `${item.total} postings`,
            }))}
          />
          <BarChart
            title="Largest industries in the cleaned sample"
            data={dataset.industryCounts.map((item) => ({
              label: item.label,
              value: item.total,
              meta: "rows",
            }))}
          />
        </div>
      </section>

      <section className="panel callout">
        <div>
          <p className="eyebrow">Why this works</p>
          <h2>The tutorial stays tied to the actual dataset outputs.</h2>
        </div>
        <p>
          The notebook tutorial is not generic text. It references the same fake job rows,
          cleaning decisions, and fraud-rate summaries shown on the main site, so the explanation
          and the visuals stay in sync.
        </p>
      </section>
    </main>
  );
}

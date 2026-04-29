"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BarChart } from "@/components/BarChart";
import { DataTable } from "@/components/DataTable";
import { DatasetSwitcher } from "@/components/DatasetSwitcher";
import { Heatmap } from "@/components/Heatmap";
import { TutorialTimeline } from "@/components/TutorialTimeline";
import { UrlPanel } from "@/components/UrlPanel";
import { resolveDatasetKey } from "@/lib/datasets";
import type { CleanedDataset } from "@/lib/fakeJobAnalysis";
import type { HeartDataset } from "@/lib/heartAnalysis";

function toRateChart(items: { label: string; rate: number; total: number }[]) {
  return items.map((item) => ({
    label: item.label,
    value: Math.round(item.rate * 100),
    suffix: "%",
    meta: `${item.total} patients`,
  }));
}

function toFraudChart(items: { label: string; fraudRate: number; total: number }[]) {
  return items.map((item) => ({
    label: item.label,
    value: Math.round(item.fraudRate * 100),
    suffix: "%",
    meta: `${item.total} postings`,
  }));
}

export function HomePageView({
  heartDataset,
  fakeJobDataset,
}: {
  heartDataset: HeartDataset;
  fakeJobDataset: CleanedDataset;
}) {
  const searchParams = useSearchParams();
  const activeDataset = resolveDatasetKey(searchParams.get("dataset") ?? undefined);

  if (activeDataset === "fake-job") {
    return (
      <main className="page-shell">
        <section className="hero panel">
          <div>
            <p className="eyebrow">Notebook Cleaning and Visualization Web App</p>
            <h1>Fake job posting data, cleaned and explained in a Next.js notebook workflow.</h1>
            <p className="hero-copy">
              This view uses the built-in fake job sheet to show how a messy tabular dataset is
              profiled, cleaned, and converted into fraud-focused visuals. The same app shell can
              now shift between notebook demos instantly.
            </p>
            <div className="hero-actions">
              <Link href="/tutorial?dataset=fake-job" className="action primary">
                Open NB Fake Job
              </Link>
              <a href="#visuals" className="action secondary">
                Jump to Visuals
              </a>
            </div>
          </div>
          <div className="metric-grid">
            <article className="metric-card">
              <span>Raw rows</span>
              <strong>{fakeJobDataset.rawRows.length}</strong>
            </article>
            <article className="metric-card">
              <span>Cleaned rows</span>
              <strong>{fakeJobDataset.cleanedRows.length}</strong>
            </article>
            <article className="metric-card">
              <span>Fraud rate</span>
              <strong>{Math.round(fakeJobDataset.fraudRate * 100)}%</strong>
            </article>
            <article className="metric-card">
              <span>Duplicates removed</span>
              <strong>{fakeJobDataset.duplicateRowsRemoved}</strong>
            </article>
          </div>
        </section>

        <UrlPanel activeDataset="fake-job" />
        <DatasetSwitcher activeDataset="fake-job" pathname="/" />
        <TutorialTimeline steps={fakeJobDataset.tutorialSteps} />

        <section className="panel section-grid">
          <div className="section-head">
            <div>
              <p className="eyebrow">Cleaning Audit</p>
              <h2>Before and after snapshots of the fake job sheet.</h2>
            </div>
            <div className="audit-chip-row">
              <span className="chip">Missing before: {fakeJobDataset.missingBefore}</span>
              <span className="chip">Missing after: {fakeJobDataset.missingAfter}</span>
              <span className="chip">
                Headers normalized: {fakeJobDataset.normalizedHeaders.slice(0, 4).join(", ")}...
              </span>
            </div>
          </div>
          <div className="table-grid">
            <DataTable
              title="Raw sheet preview"
              columns={[
                "job_id",
                "title",
                "department",
                "salary_range",
                "employment_type",
                "fraudulent",
              ]}
              rows={fakeJobDataset.rawRows.slice(0, 6)}
            />
            <DataTable
              title="Cleaned sheet preview"
              columns={[
                "job_id",
                "title",
                "department",
                "salary_range",
                "employment_type",
                "fraudulent",
              ]}
              rows={fakeJobDataset.cleanedRows.slice(0, 6)}
            />
          </div>
        </section>

        <section id="visuals" className="panel section-grid">
          <div className="section-head">
            <div>
              <p className="eyebrow">Visualization Studio</p>
              <h2>Fraud patterns surfaced from the cleaned fake job dataset.</h2>
            </div>
          </div>
          <div className="chart-grid">
            <BarChart
              title="Fraud rate by employment type"
              data={toFraudChart(fakeJobDataset.fraudByEmployment)}
            />
            <BarChart
              title="Fraud rate by company logo signal"
              data={toFraudChart(fakeJobDataset.fraudByLogo)}
            />
            <BarChart
              title="Largest industries in the cleaned sample"
              data={fakeJobDataset.industryCounts.map((item) => ({
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
            <h2>The same app can now host multiple notebook demos cleanly.</h2>
          </div>
          <p>
            The fake job view keeps its original cleaning logic and fraud-focused summaries, while
            the dataset switcher lets you move between this demo and the heart disease dashboard
            without changing deployment or app structure.
          </p>
        </section>
      </main>
    );
  }

  const diagnosisSummary = heartDataset.targetDistribution.map((item) => ({
    label: item.label,
    value: item.total,
    meta: `${Math.round(item.rate * 100)}% positive rate`,
  }));

  return (
    <main className="page-shell">
      <section className="hero panel">
        <div>
          <p className="eyebrow">Notebook Cleaning and Visualization Web App</p>
          <h1>Heart disease data, cleaned and visualized in a Next.js notebook workflow.</h1>
          <p className="hero-copy">
            This app uses the Kaggle-style heart disease dataset built from the Cleveland UCI
            schema. It loads the raw CSV, repairs category drift, derives clinical bands, and shows
            the full exploratory dashboard as a notebook-style site.
          </p>
          <div className="hero-actions">
            <Link href="/tutorial" className="action primary">
              Open NB Heart Disease
            </Link>
            <a href="#visuals" className="action secondary">
              Jump to Visuals
            </a>
          </div>
        </div>
        <div className="metric-grid">
          <article className="metric-card">
            <span>Raw rows</span>
            <strong>{heartDataset.rawRows.length}</strong>
          </article>
          <article className="metric-card">
            <span>Cleaned rows</span>
            <strong>{heartDataset.cleanedRows.length}</strong>
          </article>
          <article className="metric-card">
            <span>Diagnosis rate</span>
            <strong>{Math.round(heartDataset.diagnosisRate * 100)}%</strong>
          </article>
          <article className="metric-card">
            <span>Legacy fixes</span>
            <strong>{heartDataset.legacyCategoryFixes}</strong>
          </article>
        </div>
      </section>

      <UrlPanel activeDataset="heart" />
      <DatasetSwitcher activeDataset="heart" pathname="/" />
      <TutorialTimeline steps={heartDataset.tutorialSteps} />

      <section className="panel section-grid">
        <div className="section-head">
          <div>
            <p className="eyebrow">Cleaning Audit</p>
            <h2>Before and after snapshots of the heart disease sheet.</h2>
          </div>
          <div className="audit-chip-row">
            <span className="chip">Missing before: {heartDataset.missingBefore}</span>
            <span className="chip">Missing after: {heartDataset.missingAfter}</span>
            <span className="chip">Mean age: {heartDataset.meanAge} years</span>
            <span className="chip">Mean cholesterol: {heartDataset.meanCholesterol} mg/dL</span>
          </div>
        </div>
        <div className="table-grid">
          <DataTable
            title="Raw sheet preview"
            columns={["age", "sex", "cp", "trestbps", "chol", "thal", "target"]}
            rows={heartDataset.rawRows.slice(0, 6)}
          />
          <DataTable
            title="Cleaned sheet preview"
            columns={[
              "age",
              "sexLabel",
              "chestPainLabel",
              "trestbps",
              "chol",
              "thalLabel",
              "targetLabel",
            ]}
            rows={heartDataset.cleanedRows.slice(0, 6)}
          />
        </div>
      </section>

      <section id="visuals" className="panel section-grid">
        <div className="section-head">
          <div>
            <p className="eyebrow">Visualization Studio</p>
            <h2>Full exploratory visuals for the cleaned heart disease dataset.</h2>
          </div>
        </div>
        <div className="chart-grid">
          <BarChart title="Diagnosis distribution" data={diagnosisSummary} />
          <BarChart title="Diagnosis rate by sex" data={toRateChart(heartDataset.sexBreakdown)} />
          <BarChart
            title="Diagnosis rate by chest pain type"
            data={toRateChart(heartDataset.chestPainBreakdown)}
          />
        </div>
        <div className="chart-grid">
          <BarChart
            title="Diagnosis rate by exercise-induced angina"
            data={toRateChart(heartDataset.exerciseAnginaBreakdown)}
          />
          <BarChart
            title="Diagnosis rate by thal status"
            data={toRateChart(heartDataset.thalBreakdown)}
          />
          <BarChart
            title="Diagnosis rate by age band"
            data={toRateChart(heartDataset.ageBandBreakdown)}
          />
        </div>
        <div className="chart-grid">
          <BarChart
            title="Diagnosis rate by blood pressure band"
            data={toRateChart(heartDataset.bloodPressureBreakdown)}
          />
          <BarChart
            title="Diagnosis rate by cholesterol band"
            data={toRateChart(heartDataset.cholesterolBreakdown)}
          />
          <BarChart
            title="Diagnosis rate by max heart rate band"
            data={toRateChart(heartDataset.heartRateBreakdown)}
          />
        </div>
        <div className="chart-grid">
          <BarChart
            title="Average metric gaps between diagnosis groups"
            data={heartDataset.metricAveragesByTarget.map((item) => ({
              label: item.label,
              value: Math.abs(item.value),
              meta: `${item.value > 0 ? "higher" : "lower"}${item.unit ?? ""} in disease rows`,
            }))}
          />
          <Heatmap title="Correlation heatmap" cells={heartDataset.correlationMatrix} />
        </div>
      </section>

      <section className="panel callout">
        <div>
          <p className="eyebrow">Why this works</p>
          <h2>The tutorial stays tied to real dataset signals.</h2>
        </div>
        <p>
          The strongest single linear signal against the diagnosis label is{" "}
          <strong>{heartDataset.strongestSignal.label}</strong> with a correlation of{" "}
          <strong>{heartDataset.strongestSignal.value}</strong>. Every chart on this page is
          derived from the same cleaned CSV used in the notebook walkthrough, so the explanations
          and the visuals stay in sync.
        </p>
      </section>
    </main>
  );
}

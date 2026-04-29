import Link from "next/link";
import { BarChart } from "@/components/BarChart";
import { Heatmap } from "@/components/Heatmap";
import { DataTable } from "@/components/DataTable";
import { TutorialTimeline } from "@/components/TutorialTimeline";
import { UrlPanel } from "@/components/UrlPanel";
import { buildHeartDataset } from "@/lib/heartAnalysis";

const dataset = buildHeartDataset();

const diagnosisSummary = dataset.targetDistribution.map((item) => ({
  label: item.label,
  value: item.total,
  meta: `${Math.round(item.rate * 100)}% positive rate`,
}));

const toRateChart = (items: { label: string; rate: number; total: number }[]) =>
  items.map((item) => ({
    label: item.label,
    value: Math.round(item.rate * 100),
    suffix: "%",
    meta: `${item.total} patients`,
  }));

export default function HomePage() {
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
            <strong>{dataset.rawRows.length}</strong>
          </article>
          <article className="metric-card">
            <span>Cleaned rows</span>
            <strong>{dataset.cleanedRows.length}</strong>
          </article>
          <article className="metric-card">
            <span>Diagnosis rate</span>
            <strong>{Math.round(dataset.diagnosisRate * 100)}%</strong>
          </article>
          <article className="metric-card">
            <span>Legacy fixes</span>
            <strong>{dataset.legacyCategoryFixes}</strong>
          </article>
        </div>
      </section>

      <UrlPanel />

      <TutorialTimeline steps={dataset.tutorialSteps} />

      <section className="panel section-grid">
        <div className="section-head">
          <div>
            <p className="eyebrow">Cleaning Audit</p>
            <h2>Before and after snapshots of the heart disease sheet.</h2>
          </div>
          <div className="audit-chip-row">
            <span className="chip">Missing before: {dataset.missingBefore}</span>
            <span className="chip">Missing after: {dataset.missingAfter}</span>
            <span className="chip">
              Mean age: {dataset.meanAge} years
            </span>
            <span className="chip">
              Mean cholesterol: {dataset.meanCholesterol} mg/dL
            </span>
          </div>
        </div>
        <div className="table-grid">
          <DataTable
            title="Raw sheet preview"
            columns={["age", "sex", "cp", "trestbps", "chol", "thal", "target"]}
            rows={dataset.rawRows.slice(0, 6)}
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
            rows={dataset.cleanedRows.slice(0, 6)}
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
          <BarChart
            title="Diagnosis rate by sex"
            data={toRateChart(dataset.sexBreakdown)}
          />
          <BarChart
            title="Diagnosis rate by chest pain type"
            data={toRateChart(dataset.chestPainBreakdown)}
          />
        </div>
        <div className="chart-grid">
          <BarChart
            title="Diagnosis rate by exercise-induced angina"
            data={toRateChart(dataset.exerciseAnginaBreakdown)}
          />
          <BarChart
            title="Diagnosis rate by thal status"
            data={toRateChart(dataset.thalBreakdown)}
          />
          <BarChart
            title="Diagnosis rate by age band"
            data={toRateChart(dataset.ageBandBreakdown)}
          />
        </div>
        <div className="chart-grid">
          <BarChart
            title="Diagnosis rate by blood pressure band"
            data={toRateChart(dataset.bloodPressureBreakdown)}
          />
          <BarChart
            title="Diagnosis rate by cholesterol band"
            data={toRateChart(dataset.cholesterolBreakdown)}
          />
          <BarChart
            title="Diagnosis rate by max heart rate band"
            data={toRateChart(dataset.heartRateBreakdown)}
          />
        </div>
        <div className="chart-grid">
          <BarChart
            title="Average metric gaps between diagnosis groups"
            data={dataset.metricAveragesByTarget.map((item) => ({
              label: item.label,
              value: Math.abs(item.value),
              meta: `${item.value > 0 ? "higher" : "lower"}${item.unit ?? ""} in disease rows`,
            }))}
          />
          <Heatmap title="Correlation heatmap" cells={dataset.correlationMatrix} />
        </div>
      </section>

      <section className="panel callout">
        <div>
          <p className="eyebrow">Why this works</p>
          <h2>The tutorial stays tied to real dataset signals.</h2>
        </div>
        <p>
          The strongest single linear signal against the diagnosis label is{" "}
          <strong>{dataset.strongestSignal.label}</strong> with a correlation of{" "}
          <strong>{dataset.strongestSignal.value}</strong>. Every chart on this page is derived
          from the same cleaned CSV used in the notebook walkthrough, so the explanations and the
          visuals stay in sync.
        </p>
      </section>
    </main>
  );
}

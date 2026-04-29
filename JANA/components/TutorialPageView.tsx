"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { DatasetSwitcher } from "@/components/DatasetSwitcher";
import { UrlPanel } from "@/components/UrlPanel";
import { resolveDatasetKey } from "@/lib/datasets";
import type { CleanedDataset } from "@/lib/fakeJobAnalysis";
import type { HeartDataset } from "@/lib/heartAnalysis";

const heartNotebookCells = [
  {
    title: "Cell 1: Load the heart disease dataset",
    code: `heart_df = pd.read_csv("heart.csv")\nheart_df.head()\nheart_df.shape`,
    explanation:
      "Start with the Kaggle/UCI heart dataset and inspect row count, column names, and the diagnosis label.",
  },
  {
    title: "Cell 2: Standardize categories and types",
    code: `df.columns = normalize_headers(df.columns)\ndf["thal"] = df["thal"].replace({1: "normal", 2: "fixed"})\ndf = df.drop_duplicates()`,
    explanation:
      "The app mirrors this logic by normalizing schema names, coercing numeric fields, and harmonizing the small amount of legacy thal coding.",
  },
  {
    title: "Cell 3: Derive notebook-friendly bands",
    code: `df["age_band"] = pd.cut(df["age"], bins=[0, 45, 55, 65, 100])\ndf["chol_band"] = pd.cut(df["chol"], bins=[0, 200, 240, 700])`,
    explanation:
      "Clinical bands make the exploratory charts easier to read than raw continuous columns while preserving the dataset’s overall signal.",
  },
  {
    title: "Cell 4: Visualize diagnosis patterns",
    code: `plot_rate(df, by="cp")\nplot_rate(df, by="exang")\nplot_heatmap(df.corr(numeric_only=True))`,
    explanation:
      "The deployed app renders the same EDA outputs as static charts so the notebook story survives deployment.",
  },
];

const fakeJobNotebookCells = [
  {
    title: "Cell 1: Load the fake job data sheet",
    code: `raw_df = read_csv("fake_job_postings.csv")\nraw_df.head()`,
    explanation:
      "Start by reading the sheet and checking the incoming headers, null patterns, and the fraud label column.",
  },
  {
    title: "Cell 2: Normalize and clean columns",
    code: `df.columns = normalize_headers(df.columns)\ndf = df.drop_duplicates(subset=["job_id"])\ndf["salary_range"] = df["salary_range"].fillna("not_listed")`,
    explanation:
      "The app mirrors this logic by normalizing headers, removing duplicate job ids, and making missing text fields explicit.",
  },
  {
    title: "Cell 3: Build fraud-focused summaries",
    code: `fraud_by_type = df.groupby("employment_type")["fraudulent"].mean()\nfraud_by_logo = df.groupby("has_company_logo")["fraudulent"].mean()`,
    explanation:
      "Once the sheet is stable, aggregates become meaningful and highlight where suspicious postings cluster.",
  },
  {
    title: "Cell 4: Visualize the cleaned data",
    code: `plot_bar(fraud_by_type)\nplot_bar(fraud_by_logo)\nplot_bar(industry_counts.head(6))`,
    explanation:
      "The site renders these summaries as fast static charts that work well for a deployed Next.js app.",
  },
];

export function TutorialPageView({
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
        <section className="hero panel tutorial-hero">
          <div>
            <p className="eyebrow">NB Tutorial</p>
            <h1>Tutorial: cleaning and visualizing the fake job dataset.</h1>
            <p className="hero-copy">
              This page explains the exact process used in the fake-job view, using notebook-style
              cells and concrete outputs from the same cleaned dataset.
            </p>
          </div>
          <div className="tutorial-summary">
            <span className="chip">Rows after cleaning: {fakeJobDataset.cleanedRows.length}</span>
            <span className="chip">Fraud labels: {Math.round(fakeJobDataset.fraudRate * 100)}%</span>
            <span className="chip">
              Resolved blanks: {fakeJobDataset.missingBefore - fakeJobDataset.missingAfter}
            </span>
          </div>
        </section>

        <UrlPanel activeDataset="fake-job" />
        <DatasetSwitcher activeDataset="fake-job" pathname="/tutorial" />

        <section className="panel notebook-shell">
          {fakeJobNotebookCells.map((cell) => (
            <article key={cell.title} className="cell-card">
              <div className="card-head">
                <h2>{cell.title}</h2>
              </div>
              <pre className="code-block">
                <code>{cell.code}</code>
              </pre>
              <p>{cell.explanation}</p>
            </article>
          ))}
        </section>

        <section className="panel insight-grid">
          <article className="insight-card">
            <p className="eyebrow">Key finding</p>
            <h2>Remote and low-detail postings dominate the fraudulent sample.</h2>
            <p>
              In this fake job sheet, the highest fraud rates appear in postings with missing
              company logos, vague departments, and low-information salary fields.
            </p>
          </article>
          <article className="insight-card">
            <p className="eyebrow">Deployment note</p>
            <h2>The route-level switch keeps both demos deployable.</h2>
            <p>
              Both notebook demos now share the same static Next.js structure, so switching
              datasets does not change hosting strategy or deployment setup.
            </p>
          </article>
        </section>

        <section className="panel tutorial-footer">
          <Link href="/?dataset=fake-job" className="action secondary">
            Back to Site
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="hero panel tutorial-hero">
        <div>
          <p className="eyebrow">NB Tutorial</p>
          <h1>Tutorial: cleaning and visualizing the heart disease dataset.</h1>
          <p className="hero-copy">
            This page explains the exact process used in the web app, using notebook-style cells
            and concrete outputs from the same cleaned dataset.
          </p>
        </div>
        <div className="tutorial-summary">
          <span className="chip">Rows after cleaning: {heartDataset.cleanedRows.length}</span>
          <span className="chip">Diagnosis labels: {Math.round(heartDataset.diagnosisRate * 100)}%</span>
          <span className="chip">Legacy fixes: {heartDataset.legacyCategoryFixes}</span>
        </div>
      </section>

      <UrlPanel activeDataset="heart" />
      <DatasetSwitcher activeDataset="heart" pathname="/tutorial" />

      <section className="panel notebook-shell">
        {heartNotebookCells.map((cell) => (
          <article key={cell.title} className="cell-card">
            <div className="card-head">
              <h2>{cell.title}</h2>
            </div>
            <pre className="code-block">
              <code>{cell.code}</code>
            </pre>
            <p>{cell.explanation}</p>
          </article>
        ))}
      </section>

      <section className="panel insight-grid">
        <article className="insight-card">
          <p className="eyebrow">Key finding</p>
          <h2>Asymptomatic chest pain and exercise angina carry the clearest risk spikes.</h2>
          <p>
            After cleaning, the highest diagnosis rates cluster in asymptomatic chest pain groups,
            lower max-heart-rate bands, and patients showing exercise-induced angina.
          </p>
        </article>
        <article className="insight-card">
          <p className="eyebrow">Deployment note</p>
          <h2>Static output keeps the app easy to host.</h2>
          <p>
            The project uses Next.js static export, so the site can ship to GitHub Pages, Vercel,
            or a VM behind PM2 without adding an API or database layer.
          </p>
        </article>
      </section>

      <section className="panel tutorial-footer">
        <Link href="/" className="action secondary">
          Back to Site
        </Link>
      </section>
    </main>
  );
}

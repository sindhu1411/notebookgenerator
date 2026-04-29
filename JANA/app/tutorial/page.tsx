import Link from "next/link";
import { UrlPanel } from "@/components/UrlPanel";
import { buildHeartDataset } from "@/lib/heartAnalysis";

const dataset = buildHeartDataset();

const notebookCells = [
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

export default function TutorialPage() {
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
          <span className="chip">Rows after cleaning: {dataset.cleanedRows.length}</span>
          <span className="chip">Diagnosis labels: {Math.round(dataset.diagnosisRate * 100)}%</span>
          <span className="chip">Legacy fixes: {dataset.legacyCategoryFixes}</span>
        </div>
      </section>

      <UrlPanel />

      <section className="panel notebook-shell">
        {notebookCells.map((cell) => (
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

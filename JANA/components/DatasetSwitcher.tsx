import Link from "next/link";
import { datasetHref, datasetOptions, type DatasetKey } from "@/lib/datasets";

export function DatasetSwitcher({
  activeDataset,
  pathname,
}: {
  activeDataset: DatasetKey;
  pathname: "/" | "/tutorial";
}) {
  return (
    <section className="panel dataset-switcher">
      <div>
        <p className="eyebrow">Dataset Switch</p>
        <h2>Shift between heart disease and fake job views without changing the app shell.</h2>
      </div>
      <div className="switch-grid">
        {datasetOptions.map((dataset) => (
          <Link
            key={dataset.key}
            href={datasetHref(pathname, dataset.key)}
            className={`switch-card${dataset.key === activeDataset ? " active" : ""}`}
          >
            <span>{dataset.shortLabel}</span>
            <strong>{dataset.label}</strong>
            <p>{dataset.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

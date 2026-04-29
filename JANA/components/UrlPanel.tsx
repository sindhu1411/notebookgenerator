import Link from "next/link";
import { urlLinks } from "@/lib/site";
import type { DatasetKey } from "@/lib/datasets";

export function UrlPanel({ activeDataset }: { activeDataset: DatasetKey }) {
  return (
    <section className="panel url-panel">
      <div>
        <p className="eyebrow">URL Panels</p>
        <h2>Project links stay visible in the notebook, tutorial, and site shell.</h2>
      </div>
      <div className="url-grid">
        {urlLinks(activeDataset).map((link) => (
          <Link key={link.label} href={link.href} className="url-card">
            <span>{link.label}</span>
            <strong>{link.displayHref}</strong>
          </Link>
        ))}
      </div>
    </section>
  );
}

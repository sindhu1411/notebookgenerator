import { datasetHref, type DatasetKey } from "@/lib/datasets";

export const REPO_URL = "https://github.com/sindhu1411/notebookgenerator";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://172.20.122.71:8680";

export function urlLinks(activeDataset: DatasetKey) {
  const tutorialHref = datasetHref("/tutorial", activeDataset);
  const siteHref = datasetHref("/", activeDataset);
  const suffix = activeDataset === "heart" ? "" : "?dataset=fake-job";
  const notebookLabel = activeDataset === "heart" ? "NB Heart Disease" : "NB Fake Job";

  return [
    {
      label: notebookLabel,
      href: tutorialHref,
      displayHref: `${SITE_URL}/tutorial${suffix}`,
    },
    {
      label: "Site",
      href: siteHref,
      displayHref: `${SITE_URL}/${suffix}`,
    },
    { label: "Github", href: REPO_URL, displayHref: REPO_URL },
  ];
}

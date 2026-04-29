export const datasetOptions = [
  {
    key: "heart",
    label: "Heart Disease",
    shortLabel: "NB Heart Disease",
    description: "Clinical diagnosis EDA built from the Kaggle/UCI heart dataset.",
  },
  {
    key: "fake-job",
    label: "Fake Job",
    shortLabel: "NB Fake Job",
    description: "Fraud-signal cleaning demo built from a messy job-posting sheet.",
  },
] as const;

export type DatasetKey = (typeof datasetOptions)[number]["key"];

export function resolveDatasetKey(value: string | string[] | undefined): DatasetKey {
  const selected = Array.isArray(value) ? value[0] : value;
  return selected === "fake-job" ? "fake-job" : "heart";
}

export function datasetHref(pathname: "/" | "/tutorial", dataset: DatasetKey) {
  return dataset === "heart" ? pathname : `${pathname}?dataset=${dataset}`;
}

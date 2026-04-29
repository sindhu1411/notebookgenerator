export const REPO_URL = "https://github.com/sindhu1411/notebookgenerator";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://sindhu1411.github.io/notebookgenerator";

export const urlLinks = [
  { label: "Site", href: "/", displayHref: SITE_URL },
  { label: "NB Tutorial", href: "/tutorial", displayHref: `${SITE_URL}/tutorial` },
  { label: "GitHub", href: REPO_URL, displayHref: REPO_URL },
];

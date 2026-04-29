import { Suspense } from "react";
import { HomePageView } from "@/components/HomePageView";
import { buildFakeJobDataset } from "@/lib/fakeJobAnalysis";
import { buildHeartDataset } from "@/lib/heartAnalysis";

const heartDataset = buildHeartDataset();
const fakeJobDataset = buildFakeJobDataset();
export default function HomePage() {
  return (
    <Suspense
      fallback={
        <main className="page-shell">
          <section className="panel">
            <p className="eyebrow">Dataset Switch</p>
            <h2>Loading notebook view...</h2>
          </section>
        </main>
      }
    >
      <HomePageView heartDataset={heartDataset} fakeJobDataset={fakeJobDataset} />
    </Suspense>
  );
}

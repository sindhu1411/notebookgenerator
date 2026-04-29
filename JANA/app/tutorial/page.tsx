import { Suspense } from "react";
import { TutorialPageView } from "@/components/TutorialPageView";
import { buildFakeJobDataset } from "@/lib/fakeJobAnalysis";
import { buildHeartDataset } from "@/lib/heartAnalysis";

const heartDataset = buildHeartDataset();
const fakeJobDataset = buildFakeJobDataset();
export default function TutorialPage() {
  return (
    <Suspense
      fallback={
        <main className="page-shell">
          <section className="panel">
            <p className="eyebrow">NB Tutorial</p>
            <h2>Loading notebook tutorial...</h2>
          </section>
        </main>
      }
    >
      <TutorialPageView heartDataset={heartDataset} fakeJobDataset={fakeJobDataset} />
    </Suspense>
  );
}

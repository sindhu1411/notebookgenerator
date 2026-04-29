import type { CleaningStep } from "@/lib/fakeJobAnalysis";

export function TutorialTimeline({ steps }: { steps: CleaningStep[] }) {
  return (
    <section className="panel">
      <p className="eyebrow">NB Tutorial</p>
      <div className="timeline">
        {steps.map((step, index) => (
          <article key={step.name} className="timeline-card">
            <span className="step-index">0{index + 1}</span>
            <h3>{step.name}</h3>
            <p>{step.detail}</p>
            <strong>{step.impact}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

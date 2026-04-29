import { Fragment } from "react";

type HeatmapCell = {
  x: string;
  y: string;
  value: number;
};

function colorForValue(value: number) {
  const alpha = Math.min(Math.abs(value), 1) * 0.9 + 0.08;
  if (value >= 0) {
    return `rgba(159, 77, 37, ${alpha})`;
  }
  return `rgba(31, 107, 103, ${alpha})`;
}

export function Heatmap({
  title,
  cells,
}: {
  title: string;
  cells: HeatmapCell[];
}) {
  const xLabels = [...new Set(cells.map((cell) => cell.x))];
  const yLabels = [...new Set(cells.map((cell) => cell.y))];

  return (
    <article className="chart-card heatmap-card">
      <div className="card-head">
        <h3>{title}</h3>
      </div>
      <div
        className="heatmap-grid"
        style={{
          gridTemplateColumns: `120px repeat(${xLabels.length}, minmax(56px, 1fr))`,
        }}
      >
        <div className="heatmap-spacer" />
        {xLabels.map((label) => (
          <div key={label} className="heatmap-axis heatmap-axis-top">
            {label}
          </div>
        ))}
        {yLabels.map((yLabel) => (
          <Fragment key={yLabel}>
            <div key={`${yLabel}-axis`} className="heatmap-axis heatmap-axis-side">
              {yLabel}
            </div>
            {xLabels.map((xLabel) => {
              const cell = cells.find((entry) => entry.x === xLabel && entry.y === yLabel);
              return (
                <div
                  key={`${xLabel}-${yLabel}`}
                  className="heatmap-cell"
                  style={{ background: colorForValue(cell?.value ?? 0) }}
                  title={`${yLabel} vs ${xLabel}: ${(cell?.value ?? 0).toFixed(2)}`}
                >
                  {(cell?.value ?? 0).toFixed(2)}
                </div>
              );
            })}
          </Fragment>
        ))}
      </div>
    </article>
  );
}

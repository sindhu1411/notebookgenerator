type BarDatum = {
  label: string;
  value: number;
  suffix?: string;
  meta?: string;
};

export function BarChart({
  title,
  data,
}: {
  title: string;
  data: BarDatum[];
}) {
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <article className="chart-card">
      <div className="card-head">
        <h3>{title}</h3>
      </div>
      <div className="bar-stack">
        {data.map((item) => (
          <div key={item.label} className="bar-row">
            <div className="bar-copy">
              <span>{item.label}</span>
              <small>{item.meta}</small>
            </div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${(item.value / maxValue) * 100}%` }} />
            </div>
            <strong>
              {item.value}
              {item.suffix}
            </strong>
          </div>
        ))}
      </div>
    </article>
  );
}

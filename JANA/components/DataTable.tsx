import type { DataRow } from "@/lib/fakeJobAnalysis";

export function DataTable({
  title,
  rows,
  columns,
}: {
  title: string;
  rows: DataRow[];
  columns: string[];
}) {
  return (
    <article className="table-card">
      <div className="card-head">
        <h3>{title}</h3>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${title}-${index}`}>
                {columns.map((column) => (
                  <td key={`${index}-${column}`}>{String(row[column] ?? "")}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

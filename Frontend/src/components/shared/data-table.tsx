import { Badge } from "@/components/ui/badge";

export type Column = { key: string; label: string };

const statusTone: Record<string, "primary" | "accent" | "dark"> = {
  Delivered: "primary",
  Active: "primary",
  "In Transit": "accent",
  Pending: "accent",
  Suspended: "dark",
};

export function DataTable({
  columns,
  rows,
}: {
  columns: Column[];
  rows: Record<string, string | number>[];
}) {
  return (
    <div className="leaf-shape overflow-x-auto border border-dark/5 bg-white/70 p-2 shadow-sm shadow-dark/5">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="text-xs text-dark/40">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 font-mono font-normal">
                {col.label.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-dark/5">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-dark/80">
                  {col.key === "status" ? (
                    <Badge tone={statusTone[String(row[col.key])] ?? "dark"}>
                      {row[col.key]}
                    </Badge>
                  ) : col.key === "name" && row.image ? (
                    <div className="flex items-center gap-3">
                      {String(row.image).startsWith("/") || String(row.image).startsWith("http") ? (
                        <img
                          src={String(row.image)}
                          alt={String(row.name)}
                          className="h-10 w-10 rounded-xl object-cover shadow-sm shrink-0 border border-dark/5"
                        />
                      ) : (
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-lg shrink-0">
                          {row.image}
                        </span>
                      )}
                      <span className="font-medium text-dark">{row[col.key]}</span>
                    </div>
                  ) : (
                    row[col.key]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

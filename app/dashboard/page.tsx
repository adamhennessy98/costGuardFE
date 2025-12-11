import { Button } from "@/components/ui/button";

type SummaryCard = {
  label: string;
  value: string;
  description: string;
  trend?: {
    value: string;
    direction: "up" | "down" | "flat";
  };
};

const summaryCards: SummaryCard[] = [
  {
    label: "Invoices uploaded",
    value: "1,248",
    description: "Total invoices processed in the last 30 days.",
    trend: { value: "+12.4%", direction: "up" },
  },
  {
    label: "Invoices flagged",
    value: "86",
    description: "Items requiring review before approval.",
    trend: { value: "-3.1%", direction: "down" },
  },
  {
    label: "Average processing time",
    value: "3.2 days",
    description: "Time from upload to approval across all vendors.",
    trend: { value: "0.0%", direction: "flat" },
  },
  {
    label: "Spend variance",
    value: "$27.4K",
    description: "Variance versus forecasted spend for the period.",
    trend: { value: "+5.8%", direction: "up" },
  },
];

function TrendPill({
  direction,
  value,
}: NonNullable<SummaryCard["trend"]>) {
  const styleMap: Record<"up" | "down" | "flat", string> = {
    up: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
    down: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
    flat: "bg-slate-200 text-slate-700 dark:bg-slate-500/10 dark:text-slate-300",
  };

  const labelMap: Record<"up" | "down" | "flat", string> = {
    up: "Up",
    down: "Down",
    flat: "No change",
  };

  return (
    <span
      className={`${styleMap[direction]} inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold`}
    >
      <span className="sr-only">{labelMap[direction]} </span>
      {value}
    </span>
  );
}

export default function DashboardPage() {
  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-foreground/70">
          Key metrics across your invoice lifecycle. Replace mock figures once your
          data sources are wired.
        </p>
      </header>

      <div className="flex flex-col gap-3 rounded-xl border border-dashed border-foreground/30 bg-muted/30 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Ready to process more invoices?</h2>
          <p className="text-sm text-foreground/70">
            Upload your latest vendor statements to keep dashboards and alerts in sync.
          </p>
        </div>
        <Button asChild>
          <a href="/upload">Go to Uploads</a>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <article
            key={card.label}
            className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-background/80 p-5 shadow-sm"
          >
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-foreground/60">
                  {card.label}
                </p>
                <p className="text-2xl font-semibold">{card.value}</p>
              </div>
              <p className="text-sm text-foreground/70">{card.description}</p>
            </div>
            {card.trend ? <TrendPill {...card.trend} /> : null}
          </article>
        ))}
      </div>
    </section>
  );
}

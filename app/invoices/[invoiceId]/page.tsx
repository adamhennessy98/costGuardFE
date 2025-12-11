"use client";

import { useMemo, useState } from "react";

import type { Metadata } from "next";

import { Button } from "@/components/ui/button";

interface InvoiceDetailPageProps {
  params: {
    invoiceId: string;
  };
}

const MOCK_INVOICE = {
  invoiceId: "inv-2024-001",
  vendor: "Acme Cloud",
  invoiceDate: "Nov 05, 2025",
  dueDate: "Dec 05, 2025",
  amount: "$12,480.00",
  anomalyType: "Cost spike",
  anomalySummary: "Spend is 64% higher than the trailing 3-month average for this vendor.",
  anomalyDetails:
    "Usage increased sharply in the compute workloads for region us-west-2. Review the new instances deployed on Oct 28 to verify if they should remain active.",
  status: "Open",
  owner: "Maria Summers",
};

const PRIOR_HISTORY = [
  { invoiceId: "inv-2024-000", date: "Oct 05, 2025", amount: "$7,620.00", notes: "Baseline month" },
  { invoiceId: "inv-2024-099", date: "Sep 05, 2025", amount: "$7,480.00", notes: "No anomalies" },
  { invoiceId: "inv-2024-098", date: "Aug 05, 2025", amount: "$7,530.00", notes: "Slight increase due to storage expansion" },
];

export async function generateMetadata({
  params,
}: InvoiceDetailPageProps): Promise<Metadata> {
  return {
    title: `Invoice ${params.invoiceId} | costGuard`,
  };
}

export default function InvoiceDetailPage({
  params,
}: InvoiceDetailPageProps) {
  const [status, setStatus] = useState<"Open" | "Valid" | "Issue">(MOCK_INVOICE.status as "Open");

  const statusStyles = useMemo(() => {
    return {
      Open: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
      Valid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
      Issue: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
    } as const;
  }, []);

  const invoice = {
    ...MOCK_INVOICE,
    invoiceId: params.invoiceId,
  };

  return (
    <section className="space-y-10">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-foreground/60">
          Invoice detail
        </p>
        <h1 className="text-3xl font-bold tracking-tight">{invoice.invoiceId}</h1>
        <p className="text-sm text-foreground/70">
          Review the anomaly explanation and compare past activity for {invoice.vendor}. Replace mock data with your API response when ready.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <section className="space-y-6 rounded-2xl border border-border bg-background/80 p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-foreground/60">Vendor</p>
              <p className="text-lg font-semibold">{invoice.vendor}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-foreground/60">Amount</p>
              <p className="text-lg font-semibold">{invoice.amount}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-foreground/60">Invoice date</p>
              <p className="text-sm text-foreground/80">{invoice.invoiceDate}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-foreground/60">Due date</p>
              <p className="text-sm text-foreground/80">{invoice.dueDate}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-foreground/60">Status</p>
              <p className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusStyles[status]}`}>
                {status}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-foreground/60">Owner</p>
              <p className="text-sm text-foreground/80">{invoice.owner}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-base font-semibold">Anomaly summary</h2>
            <p className="text-sm text-foreground/80">{invoice.anomalySummary}</p>
            <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-foreground/80">
              <p className="font-medium text-foreground">Details</p>
              <p className="mt-2 leading-relaxed">{invoice.anomalyDetails}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
            <span className="text-sm text-foreground/60">Update anomaly status:</span>
            <Button
              type="button"
              variant={status === "Valid" ? "primary" : "secondary"}
              onClick={() => setStatus("Valid")}
            >
              Mark as valid
            </Button>
            <Button
              type="button"
              variant={status === "Issue" ? "primary" : "secondary"}
              onClick={() => setStatus("Issue")}
            >
              Flag as issue
            </Button>
            {status !== "Open" ? (
              <Button type="button" variant="ghost" onClick={() => setStatus("Open")}>Undo</Button>
            ) : null}
          </div>
        </section>

        <aside className="space-y-4 rounded-2xl border border-border bg-background/80 p-6 shadow-sm">
          <div>
            <h2 className="text-base font-semibold">Vendor history</h2>
            <p className="text-sm text-foreground/70">
              Prior invoices from {invoice.vendor} for comparison.
            </p>
          </div>
          <ul className="space-y-3">
            {PRIOR_HISTORY.map((entry) => (
              <li key={entry.invoiceId} className="rounded-lg border border-border bg-muted/20 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-foreground">{entry.invoiceId}</span>
                  <span className="text-foreground/70">{entry.date}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-foreground/80">
                  <span>{entry.amount}</span>
                  <span className="text-xs uppercase tracking-wide text-foreground/60">{entry.notes}</span>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}

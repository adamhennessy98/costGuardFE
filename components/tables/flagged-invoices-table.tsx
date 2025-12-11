import * as React from "react";

import Link from "next/link";

import { cn } from "@/lib/utils";

export type FlaggedInvoice = {
  id: string;
  vendor: string;
  date: string;
  amount: string;
  anomalyType: string;
  severity: "low" | "medium" | "high";
  status: "open" | "in_review" | "resolved";
};

export type FlaggedInvoicesTableProps = {
  invoices: FlaggedInvoice[];
  className?: string;
};

const severityStyles: Record<FlaggedInvoice["severity"], string> = {
  low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  high: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
};

const statusCopy: Record<FlaggedInvoice["status"], string> = {
  open: "Open",
  in_review: "In review",
  resolved: "Resolved",
};

export function FlaggedInvoicesTable({ invoices, className }: FlaggedInvoicesTableProps) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-border bg-background shadow-sm", className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-foreground/60">
            <tr>
              <th scope="col" className="px-4 py-3">Vendor</th>
              <th scope="col" className="px-4 py-3">Date</th>
              <th scope="col" className="px-4 py-3">Amount</th>
              <th scope="col" className="px-4 py-3">Anomaly</th>
              <th scope="col" className="px-4 py-3">Severity</th>
              <th scope="col" className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-background text-sm">
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-foreground/60">
                  No flagged invoices to display.
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => (
                <tr key={invoice.id} className="transition hover:bg-muted/40">
                  <td className="px-4 py-3">
                    <Link
                      href={`/invoices/${invoice.id}`}
                      className="flex items-center font-medium text-foreground hover:underline"
                    >
                      {invoice.vendor}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-foreground/70">{invoice.date}</td>
                  <td className="px-4 py-3 text-foreground/70">{invoice.amount}</td>
                  <td className="px-4 py-3 text-foreground/70">{invoice.anomalyType}</td>
                  <td className="px-4 py-3">
                    <span className={`${severityStyles[invoice.severity]} inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold`}>
                      {invoice.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-muted/60 px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-foreground/70">
                      {statusCopy[invoice.status]}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

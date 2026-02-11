import * as React from "react";

import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  type InvoiceWithAnomalies,
  type AnomalyRead,
  AnomalySeverity,
  AnomalyStatus,
} from "@/lib/api";

export type FlaggedInvoicesTableProps = {
  invoices: InvoiceWithAnomalies[];
  className?: string;
};

const severityStyles: Record<AnomalySeverity, string> = {
  [AnomalySeverity.LOW]: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  [AnomalySeverity.MEDIUM]: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  [AnomalySeverity.HIGH]: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
};

const statusCopy: Record<AnomalyStatus, string> = {
  [AnomalyStatus.UNREVIEWED]: "Unreviewed",
  [AnomalyStatus.VALID]: "Valid",
  [AnomalyStatus.ISSUE]: "Issue",
};

function formatCurrency(amount: string, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(parseFloat(amount));
  } catch {
    return `${currency} ${amount}`;
  }
}

function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

function getHighestSeverityAnomaly(anomalies: AnomalyRead[]): AnomalyRead | null {
  if (anomalies.length === 0) return null;
  
  const severityOrder = {
    [AnomalySeverity.HIGH]: 0,
    [AnomalySeverity.MEDIUM]: 1,
    [AnomalySeverity.LOW]: 2,
  };
  
  return anomalies.reduce((highest, current) => {
    return severityOrder[current.severity] < severityOrder[highest.severity]
      ? current
      : highest;
  });
}

export function FlaggedInvoicesTable({ invoices, className }: FlaggedInvoicesTableProps) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-border bg-background shadow-sm", className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-foreground/60">
            <tr>
              <th scope="col" className="px-4 py-3">Invoice ID</th>
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
              invoices.map((invoice) => {
                const primaryAnomaly = getHighestSeverityAnomaly(invoice.anomalies);
                
                return (
                  <tr key={invoice.id} className="transition hover:bg-muted/40">
                    <td className="px-4 py-3">
                      <Link
                        href={`/invoices/${invoice.id}`}
                        className="flex items-center font-medium text-foreground hover:underline"
                      >
                        {invoice.id.slice(0, 8)}...
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-foreground/70">
                      {formatDate(invoice.invoice_date)}
                    </td>
                    <td className="px-4 py-3 text-foreground/70">
                      {formatCurrency(invoice.total_amount, invoice.currency)}
                    </td>
                    <td className="px-4 py-3 text-foreground/70">
                      {primaryAnomaly?.type.replace(/_/g, " ") ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      {primaryAnomaly ? (
                        <span className={`${severityStyles[primaryAnomaly.severity]} inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold`}>
                          {primaryAnomaly.severity.toLowerCase()}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {primaryAnomaly ? (
                        <span className="rounded-full bg-muted/60 px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-foreground/70">
                          {statusCopy[primaryAnomaly.status]}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

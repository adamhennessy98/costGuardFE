"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error";
import { LoadingState } from "@/components/ui/loading";
import {
  getInvoice,
  updateAnomaly,
  type InvoiceTimeline,
  type AnomalyRead,
  AnomalyStatus,
  AnomalySeverity,
  ApiError,
} from "@/lib/api";

// TODO: Replace with actual user ID from auth context
const TEMP_USER_ID = "00000000-0000-0000-0000-000000000001";

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

const statusStyles: Record<AnomalyStatus, string> = {
  [AnomalyStatus.UNREVIEWED]: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  [AnomalyStatus.VALID]: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  [AnomalyStatus.ISSUE]: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
};

const severityStyles: Record<AnomalySeverity, string> = {
  [AnomalySeverity.LOW]: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  [AnomalySeverity.MEDIUM]: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  [AnomalySeverity.HIGH]: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
};

export default function InvoiceDetailPage() {
  const params = useParams();
  const invoiceId = params.invoiceId as string;

  const [timeline, setTimeline] = useState<InvoiceTimeline | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [updatingAnomalyId, setUpdatingAnomalyId] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const fetchInvoice = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getInvoice(invoiceId, TEMP_USER_ID);
      setTimeline(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err);
      } else {
        setError(new ApiError(0, "Unknown Error", err instanceof Error ? err.message : "Failed to load invoice"));
      }
    } finally {
      setIsLoading(false);
    }
  }, [invoiceId]);

  useEffect(() => {
    fetchInvoice();
  }, [fetchInvoice]);

  const handleUpdateAnomalyStatus = async (anomaly: AnomalyRead, newStatus: AnomalyStatus) => {
    setUpdatingAnomalyId(anomaly.id);
    setUpdateError(null);

    try {
      const updated = await updateAnomaly(anomaly.id, TEMP_USER_ID, {
        status: newStatus,
      });

      // Update local state
      setTimeline((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          anomalies: prev.anomalies.map((a) =>
            a.id === updated.id ? updated : a
          ),
        };
      });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Failed to update anomaly";
      setUpdateError(message);
      console.error("Failed to update anomaly:", err);
    } finally {
      setUpdatingAnomalyId(null);
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading invoice..." />;
  }

  if (error || !timeline) {
    return (
      <section className="space-y-4">
        <ErrorState
          title="Error loading invoice"
          error={error}
          onRetry={fetchInvoice}
        />
      </section>
    );
  }

  const { invoice, anomalies, vendor_history } = timeline;

  return (
    <section className="space-y-10">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-foreground/60">
          Invoice detail
        </p>
        <h1 className="text-3xl font-bold tracking-tight">
          {invoice.id.slice(0, 8)}...
        </h1>
        <p className="text-sm text-foreground/70">
          Review anomalies and compare with vendor history.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <section className="space-y-6 rounded-2xl border border-border bg-background/80 p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-foreground/60">Vendor ID</p>
              <p className="text-lg font-semibold">{invoice.vendor_id.slice(0, 8)}...</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-foreground/60">Amount</p>
              <p className="text-lg font-semibold">
                {formatCurrency(invoice.total_amount, invoice.currency)}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-foreground/60">Invoice date</p>
              <p className="text-sm text-foreground/80">{formatDate(invoice.invoice_date)}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-foreground/60">Created at</p>
              <p className="text-sm text-foreground/80">{formatDate(invoice.created_at)}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-foreground/60">Currency</p>
              <p className="text-sm text-foreground/80">{invoice.currency}</p>
            </div>
            {invoice.source_file_url && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-foreground/60">Source file</p>
                <p className="text-sm text-foreground/80 truncate">{invoice.source_file_url}</p>
              </div>
            )}
          </div>

          {anomalies.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold">Anomalies ({anomalies.length})</h2>
              {updateError && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
                  {updateError}
                </div>
              )}
              <div className="space-y-3">
                {anomalies.map((anomaly) => (
                  <div
                    key={anomaly.id}
                    className="rounded-lg border border-border bg-muted/30 p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`${severityStyles[anomaly.severity]} inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold`}>
                        {anomaly.severity}
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {anomaly.type.replace(/_/g, " ")}
                      </span>
                      <span className={`${statusStyles[anomaly.status]} inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ml-auto`}>
                        {anomaly.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-foreground/80 leading-relaxed">
                      {anomaly.reason_text}
                    </p>
                    {anomaly.note && (
                      <p className="mt-2 text-sm text-foreground/60 italic">
                        Note: {anomaly.note}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 border-t border-border pt-3 mt-3">
                      <span className="text-sm text-foreground/60">Update status:</span>
                      <Button
                        type="button"
                        variant={anomaly.status === AnomalyStatus.VALID ? "primary" : "secondary"}
                        disabled={updatingAnomalyId === anomaly.id}
                        onClick={() => handleUpdateAnomalyStatus(anomaly, AnomalyStatus.VALID)}
                      >
                        Mark as valid
                      </Button>
                      <Button
                        type="button"
                        variant={anomaly.status === AnomalyStatus.ISSUE ? "primary" : "secondary"}
                        disabled={updatingAnomalyId === anomaly.id}
                        onClick={() => handleUpdateAnomalyStatus(anomaly, AnomalyStatus.ISSUE)}
                      >
                        Flag as issue
                      </Button>
                      {anomaly.status !== AnomalyStatus.UNREVIEWED && (
                        <Button
                          type="button"
                          variant="ghost"
                          disabled={updatingAnomalyId === anomaly.id}
                          onClick={() => handleUpdateAnomalyStatus(anomaly, AnomalyStatus.UNREVIEWED)}
                        >
                          Reset
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {anomalies.length === 0 && (
            <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-foreground/60">
              No anomalies detected for this invoice.
            </div>
          )}
        </section>

        <aside className="space-y-4 rounded-2xl border border-border bg-background/80 p-6 shadow-sm">
          <div>
            <h2 className="text-base font-semibold">Vendor history</h2>
            <p className="text-sm text-foreground/70">
              Prior invoices from this vendor for comparison.
            </p>
          </div>
          {vendor_history.length > 0 ? (
            <ul className="space-y-3">
              {vendor_history.map((entry) => (
                <li key={entry.id} className="rounded-lg border border-border bg-muted/20 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-foreground">
                      {entry.id.slice(0, 8)}...
                    </span>
                    <span className="text-foreground/70">{formatDate(entry.invoice_date)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-foreground/80">
                    <span>{formatCurrency(entry.total_amount, entry.currency)}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-foreground/60">
              No prior invoices found for this vendor.
            </p>
          )}
        </aside>
      </div>
    </section>
  );
}

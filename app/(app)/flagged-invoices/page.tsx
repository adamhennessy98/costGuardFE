"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { FlaggedInvoicesTable } from "@/components/tables/flagged-invoices-table";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error";
import { LoadingState } from "@/components/ui/loading";
import {
  getFlaggedInvoices,
  type InvoiceWithAnomalies,
  AnomalyStatus,
  AnomalyType,
  ApiError,
} from "@/lib/api";

// TODO: Replace with actual user ID from auth context
const TEMP_USER_ID = "00000000-0000-0000-0000-000000000001";

export default function FlaggedInvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceWithAnomalies[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const [vendorQuery, setVendorQuery] = useState("");
  const [anomalyFilter, setAnomalyFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchInvoices = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Map frontend status filter to backend AnomalyStatus
      let apiStatus: AnomalyStatus | undefined;
      if (statusFilter === "unreviewed") {
        apiStatus = AnomalyStatus.UNREVIEWED;
      } else if (statusFilter === "valid") {
        apiStatus = AnomalyStatus.VALID;
      } else if (statusFilter === "issue") {
        apiStatus = AnomalyStatus.ISSUE;
      }

      const data = await getFlaggedInvoices(TEMP_USER_ID, {
        status: apiStatus,
        limit: 100,
      });
      setInvoices(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err);
      } else {
        setError(new ApiError(0, "Unknown Error", err instanceof Error ? err.message : "Failed to load invoices"));
      }
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      // Vendor search - we don't have vendor name in the response, so skip for now
      // TODO: Join vendor data or add vendor_name to InvoiceWithAnomalies response

      // Anomaly type filter
      if (anomalyFilter !== "all") {
        const hasMatchingAnomaly = invoice.anomalies.some(
          (a) => a.type === anomalyFilter
        );
        if (!hasMatchingAnomaly) return false;
      }

      return true;
    });
  }, [invoices, anomalyFilter]);

  const anomalyOptions = useMemo(() => {
    return Object.values(AnomalyType);
  }, []);

  const resetFilters = () => {
    setVendorQuery("");
    setAnomalyFilter("all");
    setStatusFilter("all");
  };

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Flagged invoices</h1>
        <p className="text-sm text-foreground/70">
          Review anomalies surfaced by automated checks.
        </p>
      </header>

      <div className="flex flex-col gap-4 rounded-xl border border-border bg-muted/30 p-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row">
          <div className="flex flex-1 flex-col gap-1">
            <label htmlFor="vendor-search" className="text-xs font-medium uppercase tracking-wide text-foreground/60">
              Search vendor
            </label>
            <input
              id="vendor-search"
              type="search"
              value={vendorQuery}
              onChange={(event) => setVendorQuery(event.target.value)}
              placeholder="e.g. Acme"
              disabled
              title="Vendor search coming soon"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 disabled:opacity-50"
            />
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <label htmlFor="anomaly-filter" className="text-xs font-medium uppercase tracking-wide text-foreground/60">
              Anomaly type
            </label>
            <select
              id="anomaly-filter"
              value={anomalyFilter}
              onChange={(event) => setAnomalyFilter(event.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
            >
              <option value="all">All</option>
              {anomalyOptions.map((option) => (
                <option key={option} value={option}>
                  {option.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <label htmlFor="status-filter" className="text-xs font-medium uppercase tracking-wide text-foreground/60">
              Status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
            >
              <option value="all">All</option>
              <option value="unreviewed">Unreviewed</option>
              <option value="valid">Valid</option>
              <option value="issue">Issue</option>
            </select>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          className="self-start text-xs sm:self-auto"
          onClick={resetFilters}
        >
          Reset filters
        </Button>
      </div>

      {error ? (
        <ErrorState
          title="Error loading invoices"
          error={error}
          onRetry={fetchInvoices}
        />
      ) : isLoading ? (
        <LoadingState message="Loading invoices..." />
      ) : (
        <FlaggedInvoicesTable invoices={filteredInvoices} />
      )}
    </section>
  );
}

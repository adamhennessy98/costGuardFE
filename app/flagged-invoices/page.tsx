"use client";

import { useMemo, useState } from "react";

import { FlaggedInvoicesTable, type FlaggedInvoice } from "@/components/tables/flagged-invoices-table";
import { Button } from "@/components/ui/button";

const MOCK_INVOICES: FlaggedInvoice[] = [
  {
    id: "inv-2024-001",
    vendor: "Acme Cloud",
    date: "Nov 05, 2025",
    amount: "$12,480.00",
    anomalyType: "Cost spike",
    severity: "high",
    status: "open",
  },
  {
    id: "inv-2024-002",
    vendor: "DataStream Labs",
    date: "Nov 06, 2025",
    amount: "$3,210.45",
    anomalyType: "New service",
    severity: "medium",
    status: "in_review",
  },
  {
    id: "inv-2024-003",
    vendor: "Brightline Analytics",
    date: "Nov 01, 2025",
    amount: "$8,760.00",
    anomalyType: "Currency mismatch",
    severity: "low",
    status: "resolved",
  },
  {
    id: "inv-2024-004",
    vendor: "Lambda Ops",
    date: "Nov 07, 2025",
    amount: "$5,890.22",
    anomalyType: "Usage surge",
    severity: "medium",
    status: "open",
  },
];

export default function FlaggedInvoicesPage() {
  const [vendorQuery, setVendorQuery] = useState("");
  const [anomalyFilter, setAnomalyFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredInvoices = useMemo(() => {
    return MOCK_INVOICES.filter((invoice) => {
      const matchesVendor = vendorQuery
        ? invoice.vendor.toLowerCase().includes(vendorQuery.toLowerCase())
        : true;
      const matchesAnomaly = anomalyFilter === "all" ? true : invoice.anomalyType === anomalyFilter;
      const matchesStatus = statusFilter === "all" ? true : invoice.status === statusFilter;
      return matchesVendor && matchesAnomaly && matchesStatus;
    });
  }, [anomalyFilter, statusFilter, vendorQuery]);

  const anomalyOptions = useMemo(() => {
    const values = new Set<string>(MOCK_INVOICES.map((invoice) => invoice.anomalyType));
    return Array.from(values).sort();
  }, []);

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Flagged invoices</h1>
        <p className="text-sm text-foreground/70">
          Review anomalies surfaced by automated checks. Replace this mock data with your backend feed
          when ready.
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
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
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
                  {option}
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
              <option value="open">Open</option>
              <option value="in_review">In review</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          className="self-start text-xs sm:self-auto"
          onClick={() => {
            setVendorQuery("");
            setAnomalyFilter("all");
            setStatusFilter("all");
          }}
        >
          Reset filters
        </Button>
      </div>

      <FlaggedInvoicesTable invoices={filteredInvoices} />
    </section>
  );
}

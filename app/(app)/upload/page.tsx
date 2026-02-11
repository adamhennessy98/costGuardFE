"use client";

import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { UploadArea } from "@/components/upload/upload-area";
import { createInvoiceWithFile, type InvoiceRead, ApiError } from "@/lib/api";

// TODO: Replace with actual user ID from auth context
const TEMP_USER_ID = "00000000-0000-0000-0000-000000000001";
// TODO: Replace with actual vendor ID selection
const TEMP_VENDOR_ID = "00000000-0000-0000-0000-000000000001";

type UploadResult = {
  file: File;
  status: "pending" | "uploading" | "success" | "error";
  invoice?: InvoiceRead;
  error?: string;
};

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<UploadResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesChange = useCallback((newFiles: File[]) => {
    setFiles(newFiles);
    // Reset results when files change
    setResults([]);
  }, []);

  const handleProcess = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);

    // Initialize results
    const initialResults: UploadResult[] = files.map((file) => ({
      file,
      status: "pending",
    }));
    setResults(initialResults);

    // Process files one by one
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Mark as uploading
      setResults((prev) =>
        prev.map((r, idx) =>
          idx === i ? { ...r, status: "uploading" } : r
        )
      );

      try {
        const invoice = await createInvoiceWithFile(
          {
            user_id: TEMP_USER_ID,
            vendor_id: TEMP_VENDOR_ID,
            currency: "USD",
          },
          file
        );

        // Mark as success
        setResults((prev) =>
          prev.map((r, idx) =>
            idx === i ? { ...r, status: "success", invoice } : r
          )
        );
      } catch (err) {
        const errorMessage =
          err instanceof ApiError
            ? err.detail?.toString() || err.message
            : err instanceof Error
            ? err.message
            : "Upload failed";

        // Mark as error
        setResults((prev) =>
          prev.map((r, idx) =>
            idx === i ? { ...r, status: "error", error: errorMessage } : r
          )
        );
      }
    }

    setIsProcessing(false);
  };

  const successCount = results.filter((r) => r.status === "success").length;
  const errorCount = results.filter((r) => r.status === "error").length;
  const hasResults = results.length > 0;

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Upload invoices</h1>
        <p className="text-sm text-foreground/70">
          Drag recent billing exports or browse to select files. Review the list below before
          submitting to your ingestion pipeline.
        </p>
      </header>

      <UploadArea
        helperText="Supported formats: CSV, XLSX, or PDF."
        accept=".csv,.xlsx,.xls,.pdf"
        onFilesChange={handleFilesChange}
      />

      <div className="flex items-center gap-3">
        <Button
          onClick={handleProcess}
          disabled={isProcessing || files.length === 0}
          className="min-w-[160px]"
        >
          {isProcessing
            ? "Processing…"
            : hasResults && successCount > 0
            ? `${successCount} Processed`
            : "Process invoices"}
        </Button>
        {hasResults && successCount > 0 && (
          <span className="text-sm text-emerald-500">
            {successCount} invoice{successCount !== 1 ? "s" : ""} uploaded successfully.
          </span>
        )}
        {hasResults && errorCount > 0 && (
          <span className="text-sm text-rose-500">
            {errorCount} failed.
          </span>
        )}
      </div>

      {hasResults && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/60">
            Upload Results
          </h3>
          <ul className="space-y-2">
            {results.map((result, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between rounded-lg border border-border bg-background/60 px-4 py-3 text-sm"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">{result.file.name}</span>
                  {result.status === "success" && result.invoice && (
                    <span className="text-xs text-foreground/60">
                      Invoice ID: {result.invoice.id.slice(0, 8)}...
                    </span>
                  )}
                  {result.status === "error" && result.error && (
                    <span className="text-xs text-rose-500">{result.error}</span>
                  )}
                </div>
                <div>
                  {result.status === "pending" && (
                    <span className="text-xs text-foreground/50">Pending</span>
                  )}
                  {result.status === "uploading" && (
                    <span className="text-xs text-amber-500">Uploading...</span>
                  )}
                  {result.status === "success" && (
                    <span className="text-xs text-emerald-500">✓ Success</span>
                  )}
                  {result.status === "error" && (
                    <span className="text-xs text-rose-500">✗ Failed</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

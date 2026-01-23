"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { UploadArea } from "@/components/upload/upload-area";

export default function UploadPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [wasSuccessful, setWasSuccessful] = useState(false);

  const handleProcess = async () => {
    setIsProcessing(true);
    setWasSuccessful(false);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setWasSuccessful(true);

    setTimeout(() => setWasSuccessful(false), 2500);
  };

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Upload invoices</h1>
        <p className="text-sm text-foreground/70">
          Drag recent billing exports or browse to select files. Review the list below before
          submitting to your ingestion pipeline.
        </p>
      </header>

      <UploadArea helperText="Supported formats: CSV, XLSX, or PDF." accept=".csv,.xlsx,.xls,.pdf" />

      <div className="flex items-center gap-3">
        <Button
          onClick={handleProcess}
          disabled={isProcessing}
          className="min-w-[160px]"
        >
          {isProcessing ? "Processing…" : wasSuccessful ? "Processed" : "Process invoices"}
        </Button>
        {wasSuccessful ? (
          <span className="text-sm text-emerald-500">Invoices queued for ingestion.</span>
        ) : null}
      </div>
    </section>
  );
}

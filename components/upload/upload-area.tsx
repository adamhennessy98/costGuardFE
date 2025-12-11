'use client';

import * as React from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

type UploadAreaProps = {
  onFilesChange?: (files: File[]) => void;
  accept?: string;
  maxFiles?: number;
  helperText?: string;
  className?: string;
};

type InternalFile = {
  file: File;
  id: string;
};

function toInternal(files: File[]): InternalFile[] {
  return files.map((file) => ({
    file,
    id: `${file.name}-${file.lastModified}`,
  }));
}

export function UploadArea({
  onFilesChange,
  accept,
  maxFiles,
  helperText = "Drag and drop files here, or click to browse.",
  className,
}: UploadAreaProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [items, setItems] = React.useState<InternalFile[]>([]);
  const [isDragging, setIsDragging] = React.useState(false);

  const updateItems = React.useCallback(
    (updater: (prev: InternalFile[]) => InternalFile[]) => {
      setItems((prev) => {
        const next = updater(prev);
        onFilesChange?.(next.map((item) => item.file));
        return next;
      });
    },
    [onFilesChange],
  );

  const handleFileAppend = React.useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) {
        return;
      }

      const incoming = Array.from(fileList);
      updateItems((prev) => {
        const deduped = toInternal(incoming).filter(
          (item) => !prev.some((existing) => existing.id === item.id),
        );

        if (typeof maxFiles === "number") {
          const available = Math.max(maxFiles - prev.length, 0);
          return [...prev, ...deduped.slice(0, available)];
        }

        return [...prev, ...deduped];
      });

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [maxFiles, updateItems],
  );

  const removeFile = React.useCallback(
    (id: string) => {
      updateItems((prev) => prev.filter((item) => item.id !== id));
    },
    [updateItems],
  );

  const handleDragOver = React.useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  }, [isDragging]);

  const handleDragLeave = React.useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (isDragging) {
      setIsDragging(false);
    }
  }, [isDragging]);

  const handleDrop = React.useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    handleFileAppend(event.dataTransfer.files);
  }, [handleFileAppend]);

  const handleKeyPress = React.useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      inputRef.current?.click();
    }
  }, []);

  return (
    <div className={cn("space-y-6", className)}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={handleKeyPress}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/40 px-6 py-10 text-center transition",
          isDragging && "border-foreground/60 bg-muted",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          className="sr-only"
          onChange={(event) => handleFileAppend(event.target.files)}
        />
        <div className="flex flex-col items-center gap-2">
          <span className="text-base font-medium">Select files to upload</span>
          <span className="text-sm text-foreground/70">{helperText}</span>
        </div>
        <Button variant="secondary">Browse files</Button>
      </div>

      {items.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/60">
            Files ready for upload
          </h3>
          <ul className="space-y-2">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-border bg-background/60 px-4 py-3 text-sm"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">{item.file.name}</span>
                  <span className="text-xs text-foreground/60">
                    {(item.file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="text-xs"
                  onClick={() => removeFile(item.id)}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

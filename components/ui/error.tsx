"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  error?: Error | ApiError | null;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

function getErrorMessage(error: Error | ApiError | null | undefined): string {
  if (!error) return "An unknown error occurred";
  
  if (error instanceof ApiError) {
    if (error.isNetworkError) {
      return "Unable to connect to the server. Please check your internet connection.";
    }
    if (error.isTimeout) {
      return "The request timed out. Please try again.";
    }
    if (error.isNotFound) {
      return "The requested resource was not found.";
    }
    if (error.isUnauthorized) {
      return "You are not authorized to access this resource.";
    }
    if (error.isForbidden) {
      return "You do not have permission to access this resource.";
    }
    if (error.isValidationError) {
      return error.message || "The submitted data was invalid.";
    }
    if (error.isServerError) {
      return "A server error occurred. Please try again later.";
    }
  }
  
  return error.message || "An unknown error occurred";
}

export function ErrorState({
  title = "Something went wrong",
  message,
  error,
  onRetry,
  retryLabel = "Try again",
  className,
}: ErrorStateProps) {
  const displayMessage = message || getErrorMessage(error);
  const showRetry = onRetry && (error instanceof ApiError ? error.isRetryable : true);

  return (
    <div
      className={cn(
        "rounded-xl border border-rose-200 bg-rose-50 p-6 dark:border-rose-500/20 dark:bg-rose-500/10",
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-500/20">
          <svg
            className="h-4 w-4 text-rose-600 dark:text-rose-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-rose-800 dark:text-rose-300">
            {title}
          </h3>
          <p className="mt-1 text-sm text-rose-700 dark:text-rose-400">
            {displayMessage}
          </p>
          {showRetry && (
            <Button
              type="button"
              variant="secondary"
              className="mt-4"
              onClick={onRetry}
            >
              {retryLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export interface InlineErrorProps {
  message: string;
  className?: string;
}

export function InlineError({ message, className }: InlineErrorProps) {
  return (
    <p
      className={cn("text-sm text-rose-600 dark:text-rose-400", className)}
      role="alert"
    >
      {message}
    </p>
  );
}

export interface ErrorBoundaryFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function ErrorBoundaryFallback({
  error,
  resetErrorBoundary,
}: ErrorBoundaryFallbackProps) {
  return (
    <div className="flex min-h-[400px] items-center justify-center p-6">
      <ErrorState
        title="An unexpected error occurred"
        error={error}
        onRetry={resetErrorBoundary}
        retryLabel="Reload"
      />
    </div>
  );
}

/**
 * API Client for costGuard Backend
 *
 * Base URL can be configured via environment variable NEXT_PUBLIC_API_URL
 * Defaults to http://localhost:8000 for local development
 */

// ============================================================================
// Configuration
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const DEFAULT_TIMEOUT_MS = 30000; // 30 seconds

// ============================================================================
// Enums (matching backend app/models/enums.py)
// ============================================================================

export enum AnomalyType {
  PRICE_CREEP = "PRICE_CREEP",
  DUPLICATE = "DUPLICATE",
  ABNORMAL_TOTAL = "ABNORMAL_TOTAL",
}

export enum AnomalySeverity {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum AnomalyStatus {
  UNREVIEWED = "UNREVIEWED",
  VALID = "VALID",
  ISSUE = "ISSUE",
}

// ============================================================================
// Types (matching backend app/schemas/)
// ============================================================================

// --- Anomaly schemas (app/schemas/anomaly.py) ---

export interface AnomalyRead {
  id: string;
  invoice_id: string;
  type: AnomalyType;
  severity: AnomalySeverity;
  status: AnomalyStatus;
  reason_text: string;
  note: string | null;
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
}

export interface AnomalyUpdate {
  status: AnomalyStatus;
  note?: string | null;
}

// --- Invoice schemas (app/schemas/invoice.py) ---

export interface InvoiceCreate {
  user_id: string;
  vendor_id?: string | null;
  vendor_name?: string | null;
  invoice_date?: string | null; // ISO date string (YYYY-MM-DD)
  total_amount?: string | null; // Decimal as string
  currency: string; // 3-character ISO currency code
  source_file_url?: string | null;
}

export interface InvoiceRead {
  id: string;
  user_id: string;
  vendor_id: string;
  invoice_date: string; // ISO date string (YYYY-MM-DD)
  total_amount: string; // Decimal comes as string from backend
  currency: string;
  source_file_url: string | null;
  created_at: string; // ISO datetime string
}

export interface InvoiceWithAnomalies extends InvoiceRead {
  anomalies: AnomalyRead[];
}

export interface InvoiceTimeline {
  invoice: InvoiceRead;
  anomalies: AnomalyRead[];
  vendor_history: InvoiceRead[];
}

// --- Item schemas (app/schemas/item.py) ---

export interface ItemCreate {
  name: string;
  description?: string | null;
}

export interface ItemRead {
  id: number;
  name: string;
  description: string | null;
}

// --- Health check ---

export interface HealthCheck {
  status: string;
}

// ============================================================================
// API Error Handling
// ============================================================================

export type ApiErrorDetail = string | Record<string, unknown> | Array<Record<string, unknown>>;

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public detail?: ApiErrorDetail,
    public isNetworkError: boolean = false,
    public isTimeout: boolean = false
  ) {
    const message = ApiError.formatMessage(status, statusText, detail, isNetworkError, isTimeout);
    super(message);
    this.name = "ApiError";
  }

  private static formatMessage(
    status: number,
    statusText: string,
    detail?: ApiErrorDetail,
    isNetworkError?: boolean,
    isTimeout?: boolean
  ): string {
    if (isTimeout) {
      return "Request timed out. Please try again.";
    }
    if (isNetworkError) {
      return "Network error. Please check your connection and try again.";
    }
    if (detail) {
      if (typeof detail === "string") {
        return detail;
      }
      if (Array.isArray(detail)) {
        // FastAPI validation errors format
        return detail.map((err) => err.msg || JSON.stringify(err)).join("; ");
      }
      return JSON.stringify(detail);
    }
    return `${status} ${statusText}`;
  }

  /** Check if error is a client error (4xx) */
  get isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  /** Check if error is a server error (5xx) */
  get isServerError(): boolean {
    return this.status >= 500;
  }

  /** Check if error is a not found error (404) */
  get isNotFound(): boolean {
    return this.status === 404;
  }

  /** Check if error is an unauthorized error (401) */
  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  /** Check if error is a forbidden error (403) */
  get isForbidden(): boolean {
    return this.status === 403;
  }

  /** Check if error is a validation error (422) */
  get isValidationError(): boolean {
    return this.status === 422;
  }

  /** Check if error is retryable */
  get isRetryable(): boolean {
    return this.isNetworkError || this.isTimeout || this.isServerError;
  }
}

// ============================================================================
// Request Helpers
// ============================================================================

interface FetchOptions extends RequestInit {
  timeout?: number;
}

async function fetchWithTimeout(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { timeout = DEFAULT_TIMEOUT_MS, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    return response;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError(0, "Timeout", undefined, false, true);
    }
    // Network error (no response from server)
    throw new ApiError(0, "Network Error", undefined, true, false);
  } finally {
    clearTimeout(timeoutId);
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let detail: ApiErrorDetail | undefined;
    try {
      const body = await response.json();
      detail = body.detail;
    } catch {
      // Response body is not JSON
    }
    throw new ApiError(response.status, response.statusText, detail);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// ============================================================================
// Retry Helper
// ============================================================================

export interface RetryOptions {
  maxRetries?: number;
  delayMs?: number;
  backoffMultiplier?: number;
  shouldRetry?: (error: ApiError, attempt: number) => boolean;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    delayMs = 1000,
    backoffMultiplier = 2,
    shouldRetry = (error) => error.isRetryable,
  } = options;

  let lastError: ApiError | undefined;
  let currentDelay = delayMs;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (!(error instanceof ApiError)) {
        throw error;
      }

      lastError = error;

      if (attempt === maxRetries || !shouldRetry(error, attempt)) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, currentDelay));
      currentDelay *= backoffMultiplier;
    }
  }

  throw lastError;
}

// ============================================================================
// API Client Functions
// ============================================================================

/**
 * Health check endpoint
 */
export async function getHealth(): Promise<HealthCheck> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/health`);
  return handleResponse<HealthCheck>(response);
}

// ----------------------------------------------------------------------------
// Invoices
// ----------------------------------------------------------------------------

/**
 * Get invoice detail with anomalies and vendor history
 */
export async function getInvoice(
  invoiceId: string,
  userId: string,
  historyLimit: number = 10
): Promise<InvoiceTimeline> {
  const params = new URLSearchParams({
    user_id: userId,
    history_limit: historyLimit.toString(),
  });

  const response = await fetchWithTimeout(
    `${API_BASE_URL}/api/invoices/${invoiceId}?${params}`
  );
  return handleResponse<InvoiceTimeline>(response);
}

/**
 * List invoices that have anomalies (flagged invoices)
 */
export async function getFlaggedInvoices(
  userId: string,
  options?: {
    status?: AnomalyStatus;
    limit?: number;
  }
): Promise<InvoiceWithAnomalies[]> {
  const params = new URLSearchParams({
    user_id: userId,
  });

  if (options?.status) {
    params.set("status", options.status);
  }
  if (options?.limit) {
    params.set("limit", options.limit.toString());
  }

  const response = await fetchWithTimeout(
    `${API_BASE_URL}/api/invoices/flagged?${params}`
  );
  return handleResponse<InvoiceWithAnomalies[]>(response);
}

/**
 * Create a new invoice with JSON payload
 */
export async function createInvoice(
  invoice: InvoiceCreate
): Promise<InvoiceRead> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/api/invoices/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(invoice),
  });
  return handleResponse<InvoiceRead>(response);
}

/**
 * Create a new invoice with file upload
 * Uses longer timeout for file uploads
 */
export async function createInvoiceWithFile(
  metadata: InvoiceCreate,
  file: File
): Promise<InvoiceRead> {
  const formData = new FormData();
  formData.append("metadata", JSON.stringify(metadata));
  formData.append("file", file);

  const response = await fetchWithTimeout(`${API_BASE_URL}/api/invoices/`, {
    method: "POST",
    body: formData,
    timeout: 60000, // 60 seconds for file uploads
  });
  return handleResponse<InvoiceRead>(response);
}

// ----------------------------------------------------------------------------
// Anomalies
// ----------------------------------------------------------------------------

/**
 * Update the status (and optional note) for a specific anomaly
 */
export async function updateAnomaly(
  anomalyId: string,
  userId: string,
  update: AnomalyUpdate
): Promise<AnomalyRead> {
  const params = new URLSearchParams({
    user_id: userId,
  });

  const response = await fetchWithTimeout(
    `${API_BASE_URL}/api/invoices/anomalies/${anomalyId}?${params}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(update),
    }
  );
  return handleResponse<AnomalyRead>(response);
}

// ----------------------------------------------------------------------------
// Items
// ----------------------------------------------------------------------------

/**
 * List all items
 */
export async function getItems(): Promise<ItemRead[]> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/api/items/`);
  return handleResponse<ItemRead[]>(response);
}

/**
 * Get a single item by ID
 */
export async function getItem(itemId: number): Promise<ItemRead> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/api/items/${itemId}`);
  return handleResponse<ItemRead>(response);
}

/**
 * Create a new item
 */
export async function createItem(item: ItemCreate): Promise<ItemRead> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/api/items/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
  return handleResponse<ItemRead>(response);
}

/**
 * Delete an item by ID
 */
export async function deleteItem(itemId: number): Promise<void> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/api/items/${itemId}`, {
    method: "DELETE",
  });
  return handleResponse<void>(response);
}

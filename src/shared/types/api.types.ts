/** Exact shape of every error response from mazad-api's HttpExceptionFilter. */
export interface ApiError {
  statusCode: number;
  errorCode: string;
  message: string;
  details: Record<string, unknown> | null;
  requestId: string;
  timestamp: string;
  path: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

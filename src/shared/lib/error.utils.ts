import { isAxiosError } from 'axios';
import type { ApiError } from '@shared/types';

/** The stable identifier to branch on — never `message`, which is free text (see AGENTS.md). */
export function getErrorCode(error: unknown): string | null {
  if (isAxiosError<ApiError>(error)) {
    return error.response?.data?.errorCode ?? null;
  }
  return null;
}

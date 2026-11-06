import { QueryFailedError } from 'typeorm';

const RETRYABLE_NETWORK_CODES = new Set([
  'ECONNREFUSED',
  'ECONNRESET',
  'ETIMEDOUT',
  'EPIPE',
]);

const RETRYABLE_POSTGRES_CODES = new Set([
  '40001', // Serialization failure
  '40P01', // Deadlock detected
  '53300', // Too many connections
  '57P01', // Admin shutdown
  '57P02', // Crash shutdown
  '57P03', // Cannot connect now
]);

export function isRetryableError(error: unknown): boolean {
  const seen = new Set<object>();
  let current: unknown = error;

  while (current instanceof Error && !seen.has(current)) {
    seen.add(current);

    const code = (current as Error & { code?: string }).code;

    if (
      code &&
      (RETRYABLE_NETWORK_CODES.has(code) ||
        RETRYABLE_POSTGRES_CODES.has(code))
    ) {
      return true;
    }

    // Node.js can wrap multiple connection errors in AggregateError.
    if (current instanceof AggregateError) {
      if (current.errors.some(isRetryableError)) {
        return true;
      }
    }

    // PostgreSQL errors can be wrapped by TypeORM.
    if (current instanceof QueryFailedError) {
      current = current.driverError;
    } else {
      current = current.cause;
    }
  }

  return false;
}

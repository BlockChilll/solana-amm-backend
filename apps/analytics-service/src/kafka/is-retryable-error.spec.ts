import { describe, it, expect } from 'vitest';
import { isRetryableError } from './is-retryable-error.js';

describe('isRetryableError', () => {
  const cases = [
    { code: 'ECONNREFUSED', expected: true },
    { code: 'ETIMEDOUT', expected: true },
    { code: '40001', expected: true },
    { code: '40P01', expected: true },
    { code: '23505', expected: false },
    { code: '42P01', expected: false },
  ];

  for (const { code, expected } of cases) {
    it(`returns ${expected} for ${code}`, () => {
      const error = Object.assign(new Error('Test error'), { code });

      expect(isRetryableError(error)).toBe(expected);
    });
  }
});

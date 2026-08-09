import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema } from './auth.schema';

describe('loginSchema', () => {
  it('accepts a valid phone and password', () => {
    const result = loginSchema.safeParse({ phone: '+9647701234567', password: '12345678' });
    expect(result.success).toBe(true);
  });

  it('rejects a short password', () => {
    const result = loginSchema.safeParse({ phone: '+9647701234567', password: '123' });
    expect(result.success).toBe(false);
  });

  it('rejects a malformed phone number', () => {
    const result = loginSchema.safeParse({ phone: 'not-a-phone', password: '12345678' });
    expect(result.success).toBe(false);
  });
});

describe('registerSchema', () => {
  it('rejects a full name that is too short', () => {
    const result = registerSchema.safeParse({
      phone: '+9647701234567',
      password: '12345678',
      fullName: 'A',
    });
    expect(result.success).toBe(false);
  });

  it('accepts a fully valid payload', () => {
    const result = registerSchema.safeParse({
      phone: '+9647701234567',
      password: '12345678',
      fullName: 'Ali Hassan',
    });
    expect(result.success).toBe(true);
  });
});

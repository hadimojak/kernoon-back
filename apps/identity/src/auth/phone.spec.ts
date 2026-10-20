import { normalizePhone } from './phone';

describe('normalizePhone', () => {
  it('accepts the common Iranian mobile shapes', () => {
    expect(normalizePhone('09121234567')).toBe('09121234567');
    expect(normalizePhone('+98 912 123 4567')).toBe('09121234567');
    expect(normalizePhone('00989121234567')).toBe('09121234567');
    expect(normalizePhone('9121234567')).toBe('09121234567');
  });

  it('rejects a landline', () => {
    expect(normalizePhone('02112345678')).toBeNull();
  });
});

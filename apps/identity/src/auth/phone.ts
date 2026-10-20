export function normalizePhone(input: string) {
  const compact = input.trim().replace(/[^\d+]/g, '');
  let national = compact;
  if (national.startsWith('+98')) national = `0${national.slice(3)}`;
  else if (national.startsWith('0098')) national = `0${national.slice(4)}`;
  else if (national.startsWith('98') && national.length === 12) {
    national = `0${national.slice(2)}`;
  } else if (national.startsWith('9') && national.length === 10) {
    national = `0${national}`;
  }
  if (!/^09\d{9}$/.test(national)) return null;
  return national;
}

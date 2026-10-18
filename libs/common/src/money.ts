export function lineTotal(unit: number, quantity: number) {
  return Math.round(unit * 100 * quantity) / 100;
}

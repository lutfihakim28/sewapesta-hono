export function generateNumber(prefix: string, iteration: number, pad: number = 5) {
  return `${prefix}${iteration.toString().padStart(pad, '0')}`;
}
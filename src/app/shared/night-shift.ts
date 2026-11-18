/**
 * "Nachtschicht": between 0:00 and 4:59 local time the hero status line
 * switches to the night text. Pure function so it can be unit-tested and
 * evaluated only in the browser (SSR renders the day text).
 */
export function isNightShift(date: Date): boolean {
  const h = date.getHours();
  return h >= 0 && h < 5;
}

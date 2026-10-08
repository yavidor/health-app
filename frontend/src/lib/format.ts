/**
 * Common formatting helpers for numbers, metrics, and time.
 */

export function formatKcal(kcal: number): string {
  return `${kcal.toLocaleString()} kcal`;
}

export function formatMinutes(mins: number): string {
  return `${mins.toLocaleString()} min`;
}

export function formatRank(rank?: number): string {
  return rank ? `#${rank}` : 'Unranked';
}

export function formatPoints(points: number): string {
  return `${points.toLocaleString()} pts`;
}

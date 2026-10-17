export function membershipLevel(xp = 0, rp = 0) {
  if (xp > 200 && rp > 600) return 3;
  if (xp > 50 && rp > 150) return 2;
  if (xp > 50) return 1;
  return 0;
}

export function membershipLabel(level: number) {
  if (!level) return "Student member";
  return `Level ${level} member`;
}

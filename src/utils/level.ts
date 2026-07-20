export function getXpRequiredForLevel(level: number) {
  return 100 + (Math.max(1, level) - 1) * 50
}

export function applyXpGain(level: number, currentXp: number, gainedXp: number) {
  let nextLevel = Math.max(1, level)
  let remainingXp = Math.max(0, currentXp) + Math.max(0, gainedXp)
  let levelsGained = 0

  while (remainingXp >= getXpRequiredForLevel(nextLevel)) {
    remainingXp -= getXpRequiredForLevel(nextLevel)
    nextLevel += 1
    levelsGained += 1
  }

  return { level: nextLevel, currentXp: remainingXp, levelsGained }
}

export function getLevelProgress(level: number, currentXp: number) {
  const requiredXp = getXpRequiredForLevel(level)
  return { currentXp, requiredXp, percentage: Math.min(100, Math.max(0, currentXp / requiredXp * 100)) }
}

import { describe, expect, it } from 'vitest'
import { applyXpGain, getLevelProgress, getXpRequiredForLevel } from './level'

describe('sistema de níveis', () => {
  it('aumenta o requisito em 50 por nível', () => {
    expect(getXpRequiredForLevel(1)).toBe(100)
    expect(getXpRequiredForLevel(5)).toBe(300)
  })

  it('processa múltiplos níveis e preserva o XP restante', () => {
    expect(applyXpGain(1, 90, 350)).toEqual({ level: 3, currentXp: 190, levelsGained: 2 })
  })

  it('calcula o progresso atual', () => {
    expect(getLevelProgress(2, 75)).toEqual({ currentXp: 75, requiredXp: 150, percentage: 50 })
  })
})

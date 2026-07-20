import { describe, expect, it } from 'vitest'
import { getCompletionId, getLocalDateKey, getPeriodKey, getWeekKey } from './taskPeriods'

describe('períodos de missão', () => {
  const date = new Date('2026-07-20T23:30:00-03:00')

  it('usa o dia UTC de forma consistente com as Functions', () => {
    expect(getLocalDateKey(date)).toBe('2026-07-21')
    expect(getPeriodKey('daily', 'abc', date)).toBe('2026-07-21')
  })

  it('gera semana ISO', () => {
    expect(getWeekKey(new Date('2026-07-20T12:00:00Z'))).toBe('2026-W30')
  })

  it('gera IDs determinísticos por frequência', () => {
    expect(getCompletionId({ id: 'abc', frequency: 'once' }, date)).toBe('abc_once_abc')
    expect(getCompletionId({ id: 'abc', frequency: 'daily' }, date)).toBe('abc_2026-07-21')
  })
})

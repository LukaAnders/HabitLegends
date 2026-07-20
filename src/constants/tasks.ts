import type { TaskDifficulty, TaskFrequency } from '../types/tasks'

export const DIFFICULTY_REWARDS: Record<TaskDifficulty, { xp: number; gold: number }> = {
  common: { xp: 40, gold: 15 },
  rare: { xp: 90, gold: 35 },
  epic: { xp: 150, gold: 60 },
  legendary: { xp: 250, gold: 100 },
}

export const DIFFICULTY_LABELS: Record<TaskDifficulty, string> = {
  common: 'Comum', rare: 'Raro', epic: 'Épico', legendary: 'Lendário',
}

export const FREQUENCY_LABELS: Record<TaskFrequency, string> = {
  once: 'Uma vez', daily: 'Diária', weekly: 'Semanal',
}

export const TASK_CATEGORIES = ['Bem-estar', 'Exercício', 'Estudos', 'Foco', 'Trabalho', 'Criatividade', 'Outro'] as const
export const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'] as const

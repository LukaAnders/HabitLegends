const messages: Record<string, string> = {
  'auth/email-already-in-use': 'Este e-mail já pertence a outro aventureiro.',
  'auth/invalid-credential': 'E-mail ou senha inválidos.',
  'auth/invalid-email': 'Informe um endereço de e-mail válido.',
  'auth/weak-password': 'A senha deve possuir pelo menos 6 caracteres.',
  'auth/popup-closed-by-user': 'A janela de login foi fechada antes da conclusão.',
  'auth/popup-blocked': 'O navegador bloqueou a janela de login.',
  'auth/too-many-requests': 'Muitas tentativas. Aguarde um pouco e tente novamente.',
  'auth/network-request-failed': 'Não foi possível conectar. Verifique sua internet.',
  'permission-denied': 'Você não possui permissão para realizar esta ação.',
  'task/already-completed': 'Esta missão já foi concluída neste período.',
  'task/inactive': 'Esta missão está pausada e não pode ser concluída.',
  'task/not-found': 'Esta missão não existe mais.',
  'player/profile-not-found': 'Seu perfil de jogador não foi encontrado.',
  'store/item-not-found': 'Este artefato não existe mais no mercado.',
  'store/already-owned': 'Este artefato já pertence ao seu inventário.',
  'store/unavailable': 'Este artefato não está disponível agora.',
  'store/level-required': 'Seu nível ainda não é suficiente para este artefato.',
  'store/insufficient-gold': 'Você não possui ouro suficiente para esta compra.',
  'inventory/item-not-owned': 'Este item não pertence ao seu inventário.',
  'inventory/item-not-equipped': 'Este item não está equipado.',
  'journey/region-not-found': 'Esta região ainda não foi revelada.',
  'journey/reward-already-claimed': 'A recompensa desta região já foi resgatada.',
  'journey/region-locked': 'Seu nível ainda não permite entrar nesta região.',
  'journey/previous-region-required': 'Conclua a região anterior antes de avançar.',
}

export function getFriendlyFirebaseError(error: unknown) {
  if (typeof error === 'object' && error && 'code' in error) {
    const code = String(error.code)
    const message = 'message' in error ? String(error.message) : ''
    return messages[message] ?? messages[code] ?? 'O reino encontrou um imprevisto. Tente novamente.'
  }
  if (error instanceof Error) return messages[error.message] ?? 'O reino encontrou um imprevisto. Tente novamente.'
  return 'O reino encontrou um imprevisto. Tente novamente.'
}

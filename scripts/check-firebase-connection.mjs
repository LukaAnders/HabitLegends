import { readFileSync } from 'node:fs'

const env = Object.fromEntries(
  readFileSync('.env', 'utf8')
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#') && line.includes('='))
    .map(line => {
      const separator = line.indexOf('=')
      return [line.slice(0, separator), line.slice(separator + 1).replace(/^['"]|['"]$/g, '')]
    }),
)

try {
  const projectId = encodeURIComponent(env.VITE_FIREBASE_PROJECT_ID)
  const apiKey = encodeURIComponent(env.VITE_FIREBASE_API_KEY)
  const endpoint = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/connectionTest/readOnlyProbe?key=${apiKey}`
  const response = await fetch(endpoint, { signal: AbortSignal.timeout(15000) })

  if ([200, 403, 404].includes(response.status)) {
    const result = response.status === 200
      ? 'documento encontrado'
      : response.status === 404
        ? 'documento inexistente'
        : 'leitura protegida pelas regras'
    console.log(`Firebase alcançado: ${result}.`)
  } else {
    const payload = await response.json().catch(() => null)
    const errorStatus = payload?.error?.status ?? 'UNKNOWN'
    const errorMessage = payload?.error?.message ?? 'Sem detalhes adicionais.'
    console.error(`Firebase respondeu ${response.status} (${errorStatus}): ${errorMessage}`)
    process.exitCode = 1
  }
} catch (error) {
  console.error(`Falha na conexão: ${error?.name ?? error?.message ?? 'erro desconhecido'}`)
  process.exitCode = 1
}

import { readFileSync } from 'node:fs'
import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'

const env = Object.fromEntries(readFileSync('.env', 'utf8').split(/\r?\n/).filter(line => line && !line.startsWith('#') && line.includes('=')).map(line => { const index = line.indexOf('='); return [line.slice(0, index), line.slice(index + 1).trim()] }))
const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS ? applicationDefault() : process.env.FIREBASE_SERVICE_ACCOUNT_JSON ? cert(JSON.parse(readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_JSON, 'utf8'))) : null
if (!credentials) throw new Error('Defina GOOGLE_APPLICATION_CREDENTIALS ou FIREBASE_SERVICE_ACCOUNT_JSON com o caminho da conta de serviço.')
if (!getApps().length) initializeApp({ credential: credentials, projectId: env.VITE_FIREBASE_PROJECT_ID })

const objective = (id, type, label, target) => ({ id, type, label, target })
const regions = [
  {
    id: 'vila-iniciantes', name: 'Vila dos Iniciantes', order: 1, minimumLevel: 1, previousRegionId: null, accent: 'emerald',
    description: 'Uma aldeia protegida por muralhas antigas, onde pequenos compromissos se transformam em grandes feitos.',
    lore: 'Toda lenda começa quando o aventureiro cumpre a primeira promessa feita a si mesmo.',
    imageUrl: '/assets/journey/village.svg',
    objectives: [objective('first_tasks', 'completedTasks', 'Concluir 3 missões', 3), objective('first_level', 'level', 'Alcançar o nível 2', 2)],
    reward: { xp: 120, gold: 80, title: 'Guardião da Vila', itemId: null },
  },
  {
    id: 'floresta-disciplina', name: 'Floresta da Disciplina', order: 2, minimumLevel: 5, previousRegionId: 'vila-iniciantes', accent: 'forest',
    description: 'Trilhas vivas testam a constância de quem ousa atravessar suas árvores ancestrais.',
    lore: 'A floresta não se curva à força; ela abre caminho para quem retorna todos os dias.',
    imageUrl: '/assets/journey/forest.svg',
    objectives: [objective('forest_tasks', 'completedTasks', 'Concluir 15 missões', 15), objective('forest_streak', 'streak', 'Manter sequência de 3 dias', 3), objective('forest_items', 'purchasedItems', 'Adquirir 2 artefatos', 2)],
    reward: { xp: 240, gold: 160, title: 'Patrulheiro da Disciplina', itemId: null },
  },
  {
    id: 'montanhas-persistencia', name: 'Montanhas da Persistência', order: 3, minimumLevel: 10, previousRegionId: 'floresta-disciplina', accent: 'frost',
    description: 'Picos gelados onde somente hábitos sólidos resistem aos ventos da dúvida.',
    lore: 'O cume pertence àquele que continuou avançando quando cada passo parecia pequeno demais.',
    imageUrl: '/assets/journey/mountains.svg',
    objectives: [objective('mountain_tasks', 'completedTasks', 'Concluir 40 missões', 40), objective('mountain_streak', 'streak', 'Manter sequência de 7 dias', 7), objective('mountain_epic', 'epicTasksCompleted', 'Concluir 3 missões épicas', 3)],
    reward: { xp: 450, gold: 300, title: 'Coração da Montanha', itemId: null },
  },
  {
    id: 'templo-foco', name: 'Templo do Foco', order: 4, minimumLevel: 20, previousRegionId: 'montanhas-persistencia', accent: 'arcane',
    description: 'Um santuário suspenso entre realidade e sonho, acessível apenas às mentes inabaláveis.',
    lore: 'Quando todo ruído silencia, a intenção do herói torna-se magia.',
    imageUrl: '/assets/journey/temple.svg',
    objectives: [objective('temple_tasks', 'completedTasks', 'Concluir 80 missões', 80), objective('temple_streak', 'streak', 'Manter sequência de 14 dias', 14), objective('temple_epic', 'epicTasksCompleted', 'Concluir 10 missões épicas', 10), objective('temple_level', 'level', 'Alcançar o nível 20', 20)],
    reward: { xp: 700, gold: 500, title: 'Oráculo do Foco', itemId: null },
  },
  {
    id: 'castelo-lendas', name: 'Castelo das Lendas', order: 5, minimumLevel: 30, previousRegionId: 'templo-foco', accent: 'gold',
    description: 'A fortaleza dourada reservada aos aventureiros que transformaram disciplina em destino.',
    lore: 'Aqui não termina a jornada. Aqui começa a história que outros heróis contarão.',
    imageUrl: '/assets/journey/castle.svg',
    objectives: [objective('castle_tasks', 'completedTasks', 'Concluir 150 missões', 150), objective('castle_streak', 'streak', 'Manter sequência de 30 dias', 30), objective('castle_legendary', 'legendaryTasksCompleted', 'Concluir 5 missões lendárias', 5), objective('castle_achievements', 'achievementsUnlocked', 'Desbloquear 10 conquistas', 10)],
    reward: { xp: 1200, gold: 1000, title: 'Lenda do Reino', itemId: null },
  },
]

const db = getFirestore()
const batch = db.batch()
for (const { id, ...region } of regions) batch.set(db.collection('journeyRegions').doc(id), { ...region, updatedAt: FieldValue.serverTimestamp() }, { merge: true })
await batch.commit()
console.log(`${regions.length} regiões adicionadas à Jornada.`)

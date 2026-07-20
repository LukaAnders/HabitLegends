import { readFileSync } from 'node:fs'
import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'

const env = Object.fromEntries(readFileSync('.env', 'utf8').split(/\r?\n/).filter(line => line && !line.startsWith('#') && line.includes('=')).map(line => { const index = line.indexOf('='); return [line.slice(0, index), line.slice(index + 1).trim()] }))
const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS ? applicationDefault() : process.env.FIREBASE_SERVICE_ACCOUNT_JSON ? cert(JSON.parse(readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_JSON, 'utf8'))) : null
if (!credentials) throw new Error('Defina GOOGLE_APPLICATION_CREDENTIALS ou FIREBASE_SERVICE_ACCOUNT_JSON com o caminho da conta de serviço.')
if (!getApps().length) initializeApp({ credential: credentials, projectId: env.VITE_FIREBASE_PROJECT_ID })

const items = [
  ['hair_squire','Corte do Escudeiro','Mechas práticas para os primeiros passos.','hair','common',120,1,'hair',40],
  ['hair_moon','Cabelos da Lua','Fios prateados tocados pelo luar.','hair','rare',320,5,'hair',40],
  ['hair_phoenix','Crina da Fênix','Chamas que renascem com o portador.','hair','legendary',980,18,'hair',40],
  ['outfit_roamer','Traje do Caminhante','Vestuário leve para longas jornadas.','outfit','common',180,1,'outfit',30],
  ['outfit_ranger','Armadura do Patrulheiro','Couro encantado da floresta antiga.','outfit','rare',420,6,'outfit',30],
  ['outfit_arcanist','Manto do Arcanista','Tecido bordado com runas esquecidas.','outfit','epic',720,12,'outfit',30],
  ['outfit_sunlord','Armadura do Senhor Solar','Forjada no coração do meio-dia.','outfit','legendary',1250,20,'outfit',30],
  ['weapon_ember','Lâmina da Brasa','Uma espada que nunca perde o calor.','weapon','common',240,2,'weapon',60],
  ['weapon_frost','Machado do Inverno','Carrega o silêncio das montanhas.','weapon','rare',480,7,'weapon',60],
  ['weapon_oracle','Cajado do Oráculo','Revela caminhos ocultos ao seu mestre.','weapon','epic',790,13,'weapon',60],
  ['weapon_solar','Espada Solar','Um artefato digno de uma lenda.','weapon','legendary',1400,22,'weapon',60],
  ['accessory_leaf','Broche Silvestre','Símbolo dos guardiões da mata.','accessory','common',150,1,'accessory',50],
  ['accessory_orb','Orbe Violeta','Concentra a energia de hábitos antigos.','accessory','epic',650,10,'accessory',50],
  ['accessory_crown','Coroa das Estrelas','Seu brilho atravessa todos os reinos.','accessory','legendary',1100,19,'accessory',50],
  ['pet_fox','Raposa Rúnica','Uma companheira astuta e leal.','pet','rare',550,8,'pet',70],
  ['pet_dragon','Draco Celeste','Pequeno no tamanho, imenso no espírito.','pet','legendary',1600,25,'pet',70],
  ['background_village','Vila do Alvorecer','O lugar onde toda lenda começa.','background','common',200,1,'background',10],
  ['background_forest','Floresta Encantada','Luzes dançam entre árvores ancestrais.','background','rare',500,7,'background',10],
  ['background_castle','Castelo das Lendas','O horizonte reservado aos maiores heróis.','background','epic',900,15,'background',10],
]
const db = getFirestore(); const batch = db.batch()
const slotFor=(id,category)=>id==='accessory_leaf'?'chestAccessory':category==='accessory'?'faceAccessory':category==='weapon'?'rightHandWeapon':category
for (const [id,name,description,category,rarity,price,requiredLevel,image,layerOrder] of items) batch.set(db.collection('storeItems').doc(id), { name, description, category, rarity, price, requiredLevel, imageUrl: `/assets/items/${image}.svg`, layerOrder, avatarSlot:slotFor(id,category), isAvailable: true, createdAt: FieldValue.serverTimestamp() }, { merge: true })
await batch.commit(); console.log(`${items.length} artefatos adicionados ao mercado.`)

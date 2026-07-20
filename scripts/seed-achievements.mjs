import { readFileSync } from 'node:fs'
import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'
const env = Object.fromEntries(readFileSync('.env','utf8').split(/\r?\n/).filter(line=>line&&!line.startsWith('#')&&line.includes('=')).map(line=>{const i=line.indexOf('=');return[line.slice(0,i),line.slice(i+1).trim()]}))
const credential = process.env.GOOGLE_APPLICATION_CREDENTIALS ? applicationDefault() : process.env.FIREBASE_SERVICE_ACCOUNT_JSON ? cert(JSON.parse(readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_JSON,'utf8'))) : null
if(!credential) throw new Error('Defina GOOGLE_APPLICATION_CREDENTIALS ou FIREBASE_SERVICE_ACCOUNT_JSON.')
if(!getApps().length) initializeApp({credential,projectId:env.VITE_FIREBASE_PROJECT_ID})
const rewards={common:{xp:75,gold:30},rare:{xp:200,gold:100},epic:{xp:550,gold:275},legendary:{xp:1200,gold:600}}
const make=(id,name,description,category,rarity,type,target,order,secret=false)=>({id,name,description,category,rarity,iconUrl:`/assets/journey/${category==='journey'?'castle':'village'}.svg`,secret,requirement:{type,target},reward:{...rewards[rarity],titleId:null,itemId:null},order,isActive:true})
const achievements=[
make('primeiros-passos','Primeiros Passos','Conclua sua primeira missão.','missions','common','completedTasks',1,1),make('aventureiro-dedicado','Aventureiro Dedicado','Conclua 10 missões.','missions','rare','completedTasks',10,2),make('mestre-rotina','Mestre da Rotina','Conclua 100 missões.','missions','epic','completedTasks',100,3),make('lenda-habitos','Lenda dos Hábitos','Conclua 500 missões.','missions','legendary','completedTasks',500,4),
make('chama-acesa','Chama Acesa','Mantenha uma sequência de 3 dias.','consistency','common','currentStreak',3,5),make('persistente','Persistente','Mantenha uma sequência de 7 dias.','consistency','rare','longestStreak',7,6),make('inabalavel','Inabalável','Mantenha uma sequência de 30 dias.','consistency','epic','longestStreak',30,7),make('eterno','Eterno','Mantenha uma sequência de 100 dias.','consistency','legendary','longestStreak',100,8),
make('aprendiz','Aprendiz','Alcance o nível 5.','progression','common','level',5,9),make('veterano','Veterano','Alcance o nível 10.','progression','rare','level',10,10),make('campeao','Campeão','Alcance o nível 25.','progression','epic','level',25,11),make('lenda-viva','Lenda Viva','Alcance o nível 50.','progression','legendary','level',50,12),
make('primeiro-artefato','Primeiro Artefato','Adquira seu primeiro artefato.','market','common','purchasedItems',1,13),make('colecionador','Colecionador','Adquira 10 artefatos.','collection','rare','purchasedItems',10,14),make('arsenal-completo','Arsenal Completo','Equipe itens em 4 categorias.','collection','epic','equippedItems',4,15),
make('explorador','Explorador','Conclua uma região da Jornada.','journey','common','journeyRegionsCompleted',1,16),make('desbravador','Desbravador','Conclua 3 regiões da Jornada.','journey','epic','journeyRegionsCompleted',3,17),make('senhor-reinos','Senhor dos Reinos','Conclua todas as regiões da Jornada.','journey','legendary','journeyRegionsCompleted',5,18),
make('desafio-epico','Desafio Épico','Conclua 5 missões épicas.','missions','epic','epicTasksCompleted',5,19),make('feito-lendario','Feito Lendário','Conclua 3 missões lendárias.','secret','legendary','legendaryTasksCompleted',3,20,true),
]
export async function seedAchievements(){const db=getFirestore(),batch=db.batch(); for(const {id,...data} of achievements) batch.set(db.collection('achievements').doc(id),{...data,updatedAt:FieldValue.serverTimestamp()},{merge:true}); await batch.commit(); console.log(`${achievements.length} conquistas adicionadas.`)}
await seedAchievements()

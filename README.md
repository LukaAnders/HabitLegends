# Habit Legends

Aplicação gamificada de hábitos construída com React, TypeScript, Vite e Firebase.

## Desenvolvimento

```bash
npm install
npm run dev
```

Copie `.env.example` para `.env` e preencha as variáveis do aplicativo Web no Firebase Console.

## Popular o mercado

O seed usa o Firebase Admin SDK e nunca é incluído no bundle do navegador.

1. No Firebase Console, abra **Configurações do projeto → Contas de serviço**.
2. Gere uma nova chave privada e salve o JSON fora do repositório.
3. Configure uma das variáveis abaixo no terminal.

PowerShell usando Application Default Credentials:

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS='C:\caminho\seguro\service-account.json'
npm run seed:store
```

Ou usando a variável específica do script:

```powershell
$env:FIREBASE_SERVICE_ACCOUNT_JSON='C:\caminho\seguro\service-account.json'
npm run seed:store
```

O seed usa IDs determinísticos e `merge`, portanto pode ser executado novamente sem duplicar itens.

## Segurança da economia

Atualmente `completeTask` e `purchaseItem` usam transações do Firestore executadas no cliente. Isso evita condições de corrida e duplicidades acidentais, mas um cliente modificado ainda pode tentar manipular o próprio perfil. Antes de produção, ambas devem ser substituídas por Cloud Functions callable usando Admin SDK. Os componentes chamam serviços isolados, permitindo essa migração sem alterar a interface.

## Validação

```bash
npm run lint
npm run build
npm run firebase:check
```

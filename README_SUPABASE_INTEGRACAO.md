# PET + Supabase Starter v1

Este pacote foi montado para o projeto atual do PET (`index.html` + `script.js` monolítico) sem exigir reescrita completa.

## Objetivo

1. Manter o app **offline-first**.
2. Preservar **modo visitante** e **PIN local**.
3. Adicionar **conta online opcional** para backup e sincronização.
4. Preparar o caminho para futura camada por turma/professor/escola.

## O que tem aqui

- `supabase-schema.sql` — tabelas e políticas RLS mínimas.
- `js/pet-config.js` — configuração global.
- `js/pet-local-driver.js` — acesso padronizado ao storage local.
- `js/pet-auth.js` — autenticação Supabase.
- `js/pet-cloud-driver.js` — persistência na nuvem.
- `js/pet-sync.js` — fila local e sincronização.
- `js/pet-repositories.js` — repositórios para perfil, progresso e sessões.
- `js/pet-bridge.js` — ponte para encaixar no projeto atual sem quebrar a UI.

## Ordem correta de implantação

### Fase 1 — sem mudar o visual

1. Copie a pasta `js/` para o projeto.
2. Adicione os scripts no `index.html` **antes** do `script.js` atual:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="js/pet-config.js"></script>
<script src="js/pet-local-driver.js"></script>
<script src="js/pet-auth.js"></script>
<script src="js/pet-cloud-driver.js"></script>
<script src="js/pet-sync.js"></script>
<script src="js/pet-repositories.js"></script>
<script src="js/pet-bridge.js"></script>
<script src="script.js"></script>
```

3. No `pet-config.js`, preencha:
   - `supabaseUrl`
   - `supabaseAnonKey`

4. Crie o projeto no Supabase e rode o SQL de `supabase-schema.sql`.

### Fase 2 — começar a usar os repositórios

Substitua acessos diretos como:

```js
profileStorageSetJson(PET_PROGRESS_KEY, payload)
```

por:

```js
window.PETRepositories.progress.saveLocalSnapshot(activeProfileId, payload)
```

E gravação de histórico por:

```js
window.PETRepositories.sessions.appendLocal(activeProfileId, sessionData)
```

### Fase 3 — sincronização real

Depois que o login estiver funcionando:

- ao finalizar rodada: `enqueueProgressSync` + `enqueueSessionSync`
- ao abrir o app: `bootstrapForCurrentProfile()`
- ao clicar em “Sincronizar”: `syncNow()`

## Decisão arquitetural

- **PIN local** continua existindo para laboratório/dispositivo compartilhado.
- **Conta online** é separada do PIN.
- **Visitante** continua sem nuvem.
- **Local é a fonte imediata**. A nuvem entra como backup e continuidade.

## Onde encaixar no seu código atual

No seu `script.js`, hoje os dados principais estão em chaves como:

- `matemagica_profile_v1`
- `pet_progress_v1`
- `pet_session_history_v1`
- `pet_session_v1`

Você já tem escopo por perfil. Isso é bom. O próximo passo não é reescrever a interface; é parar de espalhar acesso a storage em toda parte.

## Regra obrigatória

A partir da migração, não crie novas leituras/escritas diretas em `localStorage` para progresso, sessões e perfil. Passe tudo pelos repositórios.

## Limite deste pacote

Este pacote **não conecta automaticamente** todo o seu `script.js` atual. Ele entrega a fundação correta.

Motivo: seu arquivo atual é monolítico. Automatizar tudo agora aumentaria o risco de quebrar funcionalidades que já existem.

# JSM Avaliação Pro

App profissional de avaliação física e composição corporal multiprotocolo, para uso do
personal trainer / avaliador. Vite + React + Tailwind CSS. Persistência em Supabase
(Postgres + Auth), com fallback automático para `localStorage` em modo offline.

## Rodando localmente

```bash
npm install
cp .env.example .env.local   # preencha com as credenciais do seu projeto Supabase
npm run dev
```

Sem `.env.local` preenchido, o app roda em **modo offline**: login é dispensado e os dados
de alunos/avaliações ficam apenas no `localStorage` deste dispositivo.

## Supabase (back-end)

1. Crie um projeto no [Supabase](https://supabase.com).
2. Rode `supabase-schema-jsm-avaliacao.sql` no SQL Editor do projeto (cria as tabelas
   `alunos` e `avaliacoes`, com RLS por `profissional_id = auth.uid()`).
3. Copie a URL do projeto e a chave `anon` para `.env.local` (`VITE_SUPABASE_URL` e
   `VITE_SUPABASE_ANON_KEY`).
4. Adicione as mesmas duas variáveis no painel do Vercel (Project Settings > Environment
   Variables) antes do deploy.
5. Auth por e-mail/senha (Supabase Auth) protege o painel — cada profissional só vê seus
   próprios alunos/avaliações.

## Testes das fórmulas

```bash
npm test
```

Os testes validam com valores conhecidos: Jackson & Pollock 3 dobras + Siri, Faulkner
4 dobras, conversões de densidade (Siri/Brozek), TMB (Mifflin-St Jeor), IMC, RCEst, FCmax
(Tanaka/Gulati/Fox), zonas de FC (%FCmax e Karvonen) e VO2máx (Cooper/Rockport/Queens
College Step Test).

## Build e deploy no Vercel

```bash
npm run build
npx vercel deploy --prod
```

O `vercel.json` já está configurado (`framework: vite`, `outputDirectory: dist`, rewrite SPA).
Lembre-se de configurar `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no painel do Vercel.

## Estrutura

- `src/calculations/` — funções puras (fórmulas), sem dependência de UI. Cada função retorna
  `{ value/density, source }` com a citação do protocolo usado. Inclui composição corporal,
  TMB/macros, risco cardiovascular, frequência cardíaca (`heartRate.js`) e VO2máx (`vo2max.js`).
- `src/components/steps/` — as 5 etapas do fluxo de avaliação (Identificação → Protocolo →
  Dados → Resultados → Orientação). A etapa de Resultados tem sub-abas: Composição corporal,
  Frequência Cardíaca e VO2máx.
- `src/components/alunos/` — lista de alunos, cadastro e ficha do aluno (dados cadastrais +
  histórico de avaliações + evolução).
- `src/components/evolucao/` — gráficos de evolução (`recharts`, últimas 6 avaliações) e
  comparativo antes/depois entre duas avaliações.
- `src/lib/supabase.js`, `src/lib/db.js`, `src/lib/localStore.js` — client Supabase e camada
  de dados com fallback offline automático.
- `src/hooks/useAuth.js` — sessão do profissional (Supabase Auth).
- `src/utils/computeAssessment.js` — orquestra os cálculos de composição corporal de uma
  avaliação completa. `src/utils/evolutionParams.js` define os parâmetros plotáveis na
  evolução e a direção de "melhora" de cada um (conforme o objetivo do aluno).

## Coeficientes marcados como `// VALIDAR`

Por instrução do briefing do produto, nenhum coeficiente foi "chutado": tudo que não pôde
ser conferido com segurança contra a publicação original foi implementado com a marcação
`// VALIDAR` no código-fonte e deve ser conferido manualmente antes de uso profissional/
comercial:

1. **Durnin & Womersley (1974)** — tabela de constantes `c`/`m` por sexo e faixa etária
   (`src/calculations/constants.js` → `DURNIN_WOMERSLEY_TABLE`).
2. **Lohman (1992)** — constantes de conversão densidade→%G específicas por idade/sexo,
   usadas para crianças e idosos (`src/calculations/density.js` → `LOHMAN_CONSTANTS`).
3. **Slaughter et al. (1988)** — versão tríceps+subescapular (a versão tríceps+panturrilha
   está com coeficientes confirmados; a tríceps+subescapular foi implementada na forma geral,
   sem segmentação por estágio de maturação sexual) (`src/calculations/density.js` →
   `slaughterTricepsSubscapular`).
4. **Petroski (1995)** — equação brasileira de 4 dobras (`src/calculations/density.js` →
   `petroski4`).
5. **Guedes (1985)** — equação brasileira de 3 dobras (`src/calculations/density.js` →
   `guedes3`).
6. **Lee et al. (2000)** — equação antropométrica de massa muscular esquelética, incluindo os
   coeficientes de correção das circunferências pelas dobras cutâneas e a constante de etnia
   (`src/calculations/muscleMass.js` → `skeletalMuscleMassLee`). Sempre exibida na UI como
   "estimativa", nunca como medida direta.
7. **Classificação de VO2máx (Cooper Institute / ACSM)** — tabela normativa de 6 categorias
   por faixa etária e sexo (`src/calculations/vo2max.js` → `TABELA_VO2_VALIDAR`). A estrutura
   segue o padrão dessas referências, mas os cortes exatos devem ser conferidos.

Fórmulas **confirmadas e testadas** contra a literatura (sem marcação VALIDAR): Siri (1961),
Brozek (1963), Jackson & Pollock 3 e 7 dobras (homens), Jackson-Pollock-Ward 3 e 7 dobras
(mulheres), Faulkner 4 dobras (1968), Slaughter tríceps+panturrilha (1988), Mifflin-St Jeor,
Harris-Benedict revisada, Katch-McArdle, Cunningham, Schofield/FAO-WHO-UNU pediátrica (1985),
FCmax Tanaka (2001)/Gulati (2010)/Fox (1971), zonas de FC por %FCmax e Karvonen, VO2máx por
Cooper (1968), Rockport/Kline et al. (1987) e Queens College Step Test/McArdle et al. (1972).

## Avisos éticos

- Ferramenta de apoio à decisão do profissional; não substitui avaliação médica.
- A orientação de dieta/macros é educativa/referencial — a prescrição dietética
  individualizada é atribuição do nutricionista (CFN).
- Para crianças, o app nunca gera dieta restritiva e recomenda encaminhamento ao pediatra.
- FCmax e VO2máx estimados por equações/testes de campo têm grande variabilidade
  interindividual — são estimativas, não substituem ergoespirometria/teste ergométrico.

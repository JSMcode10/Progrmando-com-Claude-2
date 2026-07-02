# JSM Avaliação Pro

App profissional de avaliação física e composição corporal multiprotocolo, para uso do
personal trainer / avaliador. Vite + React + Tailwind CSS, sem backend (persistência local
via `localStorage`).

## Rodando localmente

```bash
npm install
npm run dev
```

## Testes das fórmulas

```bash
npm test
```

Os testes (`src/calculations/__tests__/calculations.test.js`) validam com valores conhecidos:
Jackson & Pollock 3 dobras + Siri, Faulkner 4 dobras, conversões de densidade (Siri/Brozek),
TMB (Mifflin-St Jeor), IMC e RCEst.

## Build e deploy no Vercel

```bash
npm run build
npx vercel deploy --prod
```

O `vercel.json` já está configurado (`framework: vite`, `outputDirectory: dist`, rewrite SPA).

## Estrutura

- `src/calculations/` — funções puras (fórmulas), sem dependência de UI. Cada função retorna
  `{ value/density, source }` com a citação do protocolo usado.
- `src/components/steps/` — as 5 etapas do fluxo (Identificação → Protocolo → Dados →
  Resultados → Orientação).
- `src/utils/computeAssessment.js` — orquestra os cálculos de uma avaliação completa.
- `src/hooks/useAssessmentHistory.js` — histórico de avaliações em `localStorage`.

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

Fórmulas **confirmadas e testadas** contra a literatura (sem marcação VALIDAR): Siri (1961),
Brozek (1963), Jackson & Pollock 3 e 7 dobras (homens), Jackson-Pollock-Ward 3 e 7 dobras
(mulheres), Faulkner 4 dobras (1968), Slaughter tríceps+panturrilha (1988), Mifflin-St Jeor,
Harris-Benedict revisada, Katch-McArdle, Cunningham, Schofield/FAO-WHO-UNU pediátrica (1985).

## Avisos éticos

- Ferramenta de apoio à decisão do profissional; não substitui avaliação médica.
- A orientação de dieta/macros é educativa/referencial — a prescrição dietética
  individualizada é atribuição do nutricionista (CFN).
- Para crianças, o app nunca gera dieta restritiva e recomenda encaminhamento ao pediatra.

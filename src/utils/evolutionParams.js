// Definição dos parâmetros plotáveis na evolução do aluno: como extrair o
// valor de uma avaliação salva e se "melhora" significa subir ou descer
// (usado para colorir o delta de verde/vermelho conforme o objetivo).

const FIXED_DIRECTIONS = {
  pctG: 'down',
  massaGorda: 'down',
  massaMagra: 'up',
  massaMuscular: 'up',
  cintura: 'down',
  abdome: 'down',
  quadril: 'neutral',
  rcq: 'down',
  rcest: 'down',
  tmb: 'up',
  get: 'neutral',
  vo2max: 'up',
  fcRepouso: 'down',
  somatorioDobras: 'down',
};

function num(v) {
  return v === undefined || v === null || Number.isNaN(Number(v)) ? null : Number(v);
}

export const PARAM_DEFS = [
  { key: 'peso', label: 'Peso', unit: 'kg', decimals: 1, extract: (a) => num(a.resultado_completo?.composicao?.peso) },
  { key: 'pctG', label: '% de gordura', unit: '%', decimals: 1, extract: (a) => num(a.resultado_completo?.composicao?.pctGMedio) },
  { key: 'massaGorda', label: 'Massa gorda', unit: 'kg', decimals: 1, extract: (a) => num(a.resultado_completo?.composicao?.massaGorda) },
  { key: 'massaMagra', label: 'Massa magra', unit: 'kg', decimals: 1, extract: (a) => num(a.resultado_completo?.composicao?.massaMagra) },
  { key: 'massaMuscular', label: 'Massa muscular (estimativa)', unit: 'kg', decimals: 1, extract: (a) => num(a.resultado_completo?.composicao?.massaMuscular?.value) },
  { key: 'imc', label: 'IMC', unit: '', decimals: 1, extract: (a) => num(a.resultado_completo?.composicao?.imc) },
  { key: 'cintura', label: 'Cintura', unit: 'cm', decimals: 1, extract: (a) => num(a.entradas?.circunferencias?.cintura) },
  { key: 'abdome', label: 'Abdômen', unit: 'cm', decimals: 1, extract: (a) => num(a.entradas?.circunferencias?.abdome) },
  { key: 'quadril', label: 'Quadril', unit: 'cm', decimals: 1, extract: (a) => num(a.entradas?.circunferencias?.quadril) },
  { key: 'rcq', label: 'RCQ', unit: '', decimals: 2, extract: (a) => num(a.resultado_completo?.composicao?.risco?.rcq?.value) },
  { key: 'rcest', label: 'RCEst', unit: '', decimals: 2, extract: (a) => num(a.resultado_completo?.composicao?.risco?.rcest?.value) },
  { key: 'tmb', label: 'TMB', unit: 'kcal', decimals: 0, extract: (a) => num(a.resultado_completo?.composicao?.tmb?.value) },
  { key: 'get', label: 'GET', unit: 'kcal', decimals: 0, extract: (a) => num(a.resultado_completo?.composicao?.get) },
  { key: 'vo2max', label: 'VO2máx', unit: 'ml/kg/min', decimals: 1, extract: (a) => num(a.resultado_completo?.vo2?.value) },
  { key: 'fcRepouso', label: 'FC de repouso', unit: 'bpm', decimals: 0, extract: (a) => num(a.resultado_completo?.fc?.fcRepouso) },
  { key: 'somatorioDobras', label: 'Somatório de dobras', unit: 'mm', decimals: 1, extract: (a) => num(a.resultado_completo?.composicao?.protocolResults?.[0]?.sum) },
];

export function paramDef(key) {
  return PARAM_DEFS.find((p) => p.key === key);
}

export function resolveDirection(key, objetivo) {
  if (key === 'peso') return objetivo === 'hipertrofia' ? 'up' : objetivo === 'emagrecer' ? 'down' : 'neutral';
  if (key === 'imc') return objetivo === 'hipertrofia' ? 'neutral' : 'down';
  return FIXED_DIRECTIONS[key] || 'neutral';
}

// Retorna { cor: 'verde'|'vermelho'|'neutro', sinal: '+'|'-' } para o delta
// entre o primeiro e o último valor.
export function classificarDelta(delta, direction) {
  if (delta === 0 || delta == null) return { cor: 'neutro' };
  if (direction === 'neutral') return { cor: 'neutro' };
  const subiu = delta > 0;
  const melhora = direction === 'up' ? subiu : !subiu;
  return { cor: melhora ? 'verde' : 'vermelho' };
}

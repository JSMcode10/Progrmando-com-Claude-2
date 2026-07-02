// VO2máx estimado por testes de campo validados. São ESTIMATIVAS indiretas —
// a medida direta é a ergoespirometria. Grande variabilidade interindividual.

export function cooper12min({ distanciaMetros }) {
  const value = (distanciaMetros - 504.9) / 44.73;
  return { value, source: 'Cooper (1968) — teste de 12 minutos' };
}

export function rockport1Milha({ pesoKg, idade, sexo, tempoMin, fcFinal }) {
  const pesoLb = pesoKg * 2.20462;
  const sexoNum = sexo === 'masculino' ? 1 : 0;
  const value =
    132.853 - 0.0769 * pesoLb - 0.3877 * idade + 6.315 * sexoNum - 3.2649 * tempoMin - 0.1565 * fcFinal;
  return { value, source: 'Kline et al. (1987) — Rockport 1 milha' };
}

export function queensCollegeStep({ fcRecuperacao, sexo }) {
  const value = sexo === 'masculino' ? 111.33 - 0.42 * fcRecuperacao : 65.81 - 0.1847 * fcRecuperacao;
  return { value, source: 'McArdle et al. (1972) — Queens College Step Test' };
}

// Sugestão automática de teste por perfil (o profissional pode trocar manualmente).
export function sugerirTesteVO2({ populacao, espacoReduzido }) {
  if (espacoReduzido) return 'queens';
  if (populacao === 'idoso' || populacao === 'crianca') return 'rockport';
  if (populacao === 'atleta') return 'cooper';
  return 'rockport';
}

// Classificação normativa de VO2máx por faixa etária e sexo.
// VALIDAR: os cortes abaixo reproduzem a estrutura geral das tabelas
// normativas do Cooper Institute / ACSM (6 categorias), mas os valores
// exatos por faixa etária/sexo devem ser conferidos contra a publicação
// original (Cooper Institute Physical Fitness Assessments / ACSM's
// Guidelines for Exercise Testing and Prescription) antes de uso
// profissional — foram reproduzidos de memória / fontes secundárias.
const TABELA_VO2_VALIDAR = {
  masculino: [
    { min: 20, max: 29, cortes: [38, 44, 52, 57, 63] },
    { min: 30, max: 39, cortes: [34, 41, 48, 54, 60] },
    { min: 40, max: 49, cortes: [32, 38, 45, 50, 56] },
    { min: 50, max: 59, cortes: [27, 34, 41, 46, 52] },
    { min: 60, max: 200, cortes: [24, 30, 36, 42, 48] },
  ],
  feminino: [
    { min: 20, max: 29, cortes: [28, 34, 41, 46, 52] },
    { min: 30, max: 39, cortes: [27, 33, 39, 44, 50] },
    { min: 40, max: 49, cortes: [25, 31, 36, 41, 46] },
    { min: 50, max: 59, cortes: [21, 27, 32, 37, 42] },
    { min: 60, max: 200, cortes: [18, 24, 28, 32, 37] },
  ],
};

const CATEGORIAS = ['Muito fraco', 'Fraco', 'Regular', 'Bom', 'Excelente', 'Superior'];

export function classificarVO2max(vo2, idade, sexo) {
  const tabela = TABELA_VO2_VALIDAR[sexo] || TABELA_VO2_VALIDAR.masculino;
  const faixa = tabela.find((f) => idade >= f.min && idade <= f.max) || tabela[tabela.length - 1];
  const idx = faixa.cortes.findIndex((corte) => vo2 < corte);
  const categoria = idx === -1 ? CATEGORIAS[CATEGORIAS.length - 1] : CATEGORIAS[idx];
  return {
    categoria,
    source: 'Cooper Institute / ACSM — VALIDAR tabela de cortes',
  };
}

const ORIENTACAO_POR_CATEGORIA = {
  'Muito fraco': 'Priorize atividade aeróbia leve e progressiva, 3-5x/semana, com foco em consistência antes de intensidade.',
  Fraco: 'Priorize base aeróbia contínua 3x/semana; introduza progressão de volume antes de intervalados.',
  Regular: "VO2máx 'Regular' — priorize base aeróbia contínua 3x/semana e progrida para intervalados quando estabilizar.",
  Bom: 'Condicionamento já é bom; pode incluir treino intervalado (HIIT) 1-2x/semana somado à base aeróbia.',
  Excelente: 'Condicionamento elevado; use treino intervalado e polarizado para seguir progredindo.',
  Superior: 'Condicionamento de elite; periodização avançada e testes específicos de performance são recomendados.',
};

export function orientacaoVO2({ categoria, riscoElevado }) {
  const avisos = [];
  if (riscoElevado) {
    avisos.push('Risco cardiovascular elevado identificado na outra aba — recomenda-se avaliação médica antes de testes/treinos de alta intensidade.');
  }
  return { texto: ORIENTACAO_POR_CATEGORIA[categoria] || '', avisos };
}

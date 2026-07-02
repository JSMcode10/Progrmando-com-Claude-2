// Frequência cardíaca máxima (estimada), zonas de treino por %FCmax e método
// de Karvonen (FC de reserva). Toda FCmax aqui é uma ESTIMATIVA de equação de
// regressão — variabilidade interindividual grande; não substitui teste
// ergométrico/ergoespirometria.

export function fcMaxTanaka(idade) {
  return { value: 208 - 0.7 * idade, source: 'Tanaka, Monahan & Seals (2001)' };
}

export function fcMaxGulati(idade) {
  return { value: 206 - 0.88 * idade, source: 'Gulati et al. (2010) — mulheres' };
}

export function fcMaxFox(idade) {
  return { value: 220 - idade, source: 'Fox et al. (1971) — comparativo, menor validade' };
}

export function compararFcMax(idade) {
  return {
    tanaka: fcMaxTanaka(idade),
    gulati: fcMaxGulati(idade),
    fox: fcMaxFox(idade),
  };
}

export function selecionarFcMaxEquacao(sexo) {
  return sexo === 'feminino' ? 'tanaka' : 'tanaka'; // Tanaka é o padrão recomendado para ambos os sexos.
}

export function calcularFcMax(equacao, idade) {
  switch (equacao) {
    case 'gulati':
      return fcMaxGulati(idade);
    case 'fox':
      return fcMaxFox(idade);
    default:
      return fcMaxTanaka(idade);
  }
}

export const ZONAS_FC = [
  { id: 'Z1', pctMin: 0.5, pctMax: 0.6, foco: 'Recuperação / muito leve' },
  { id: 'Z2', pctMin: 0.6, pctMax: 0.7, foco: 'Base aeróbia / oxidação de gordura' },
  { id: 'Z3', pctMin: 0.7, pctMax: 0.8, foco: 'Aeróbio / condicionamento' },
  { id: 'Z4', pctMin: 0.8, pctMax: 0.9, foco: 'Limiar / anaeróbio' },
  { id: 'Z5', pctMin: 0.9, pctMax: 1.0, foco: 'Máximo / VO2' },
];

// Zonas por % simples da FCmax.
export function zonasPorPercentual(fcMax) {
  return ZONAS_FC.map((z) => ({
    ...z,
    bpmMin: Math.round(fcMax * z.pctMin),
    bpmMax: Math.round(fcMax * z.pctMax),
  }));
}

// Zonas por método de Karvonen (FC de reserva), mais individualizado quando
// há FC de repouso medida. FC alvo = ((FCmax - FCrepouso) * %intensidade) + FCrepouso
export function zonasKarvonen(fcMax, fcRepouso) {
  const reserva = fcMax - fcRepouso;
  return ZONAS_FC.map((z) => ({
    ...z,
    bpmMin: Math.round(reserva * z.pctMin + fcRepouso),
    bpmMax: Math.round(reserva * z.pctMax + fcRepouso),
  }));
}

// Orientação prática ligada ao objetivo/risco do aluno.
export function orientacaoFC({ objetivo, populacao, riscoElevado }) {
  const avisos = [];
  let texto;

  if (riscoElevado) {
    avisos.push('Risco cardiovascular elevado ou população idosa: buscar liberação médica antes de treinar em Z4–Z5.');
  }
  if (populacao === 'idoso') {
    avisos.push('Idoso: priorize Z1–Z3, com progressão gradual e supervisão.');
  }

  if (objetivo === 'emagrecer') {
    texto = 'Para emagrecimento com este perfil, priorize volume em Z2–Z3 (base aeróbia); use Z4–Z5 em blocos curtos, se liberado.';
  } else if (objetivo === 'hipertrofia') {
    texto = 'O condicionamento cardiovascular é complementar ao treino de força; Z2–Z3 em 1-2 sessões/semana mantém a base aeróbia sem prejudicar a recuperação.';
  } else {
    texto = 'Para manutenção, distribua o treino entre Z2 (base) e Z3–Z4 (condicionamento), conforme tolerância.';
  }

  return { texto, avisos };
}

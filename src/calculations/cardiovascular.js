// Risco cardiovascular por antropometria: circunferência da cintura, RCQ e RCEst.
import { WAIST_CUTOFFS, WHR_CUTOFFS, WHTR_CUTOFF } from './constants.js';

export function classificarCinturaOMS(cintura, sexo) {
  const c = WAIST_CUTOFFS[sexo];
  if (cintura >= c.high) return { nivel: 'vermelho', texto: 'Risco muito aumentado' };
  if (cintura >= c.increased) return { nivel: 'amarelo', texto: 'Risco aumentado' };
  return { nivel: 'verde', texto: 'Risco baixo' };
}

export function calcularRCQ(cintura, quadril) {
  const rcq = cintura / quadril;
  return { value: rcq };
}

export function classificarRCQ(rcq, sexo) {
  const cutoff = WHR_CUTOFFS[sexo];
  if (rcq > cutoff) return { nivel: 'vermelho', texto: 'Risco elevado' };
  return { nivel: 'verde', texto: 'Risco baixo' };
}

export function calcularRCEst(cintura, alturaCm) {
  return { value: cintura / alturaCm };
}

export function classificarRCEst(rcest) {
  if (rcest >= WHTR_CUTOFF) return { nivel: 'vermelho', texto: 'Risco aumentado (RCEst ≥ 0,5)' };
  return { nivel: 'verde', texto: 'Risco baixo' };
}

// RCQ e RCEst não se aplicam a crianças pequenas ou gestantes.
export function riscoAplicavel(populacao, idade) {
  if (populacao === 'crianca' && idade < 10) return false;
  return true;
}

export function avaliarRiscoCardiovascular({ cintura, quadril, alturaCm, sexo, populacao, idade }) {
  const aplicavel = riscoAplicavel(populacao, idade);
  const resultado = {
    aplicavel,
    cintura: cintura != null ? { value: cintura, ...classificarCinturaOMS(cintura, sexo) } : null,
    rcq: null,
    rcest: null,
  };
  if (!aplicavel) return resultado;

  if (cintura != null && quadril) {
    const rcq = calcularRCQ(cintura, quadril);
    resultado.rcq = { value: rcq.value, ...classificarRCQ(rcq.value, sexo) };
  }
  if (cintura != null && alturaCm) {
    const rcest = calcularRCEst(cintura, alturaCm);
    resultado.rcest = { value: rcest.value, ...classificarRCEst(rcest.value) };
  }
  return resultado;
}

// Taxa Metabólica Basal (TMB) e Gasto Energético Total (GET).
import { ACTIVITY_FACTORS } from './constants.js';

export function mifflinStJeor({ peso, alturaCm, idade, sexo }) {
  const base = 10 * peso + 6.25 * alturaCm - 5 * idade;
  const value = sexo === 'masculino' ? base + 5 : base - 161;
  return { value, source: 'Mifflin-St Jeor (1990)' };
}

export function harrisBenedict({ peso, alturaCm, idade, sexo }) {
  const value =
    sexo === 'masculino'
      ? 88.362 + 13.397 * peso + 4.799 * alturaCm - 5.677 * idade
      : 447.593 + 9.247 * peso + 3.098 * alturaCm - 4.33 * idade;
  return { value, source: 'Harris-Benedict revisada (1984)' };
}

export function katchMcArdle({ mlgKg }) {
  return { value: 370 + 21.6 * mlgKg, source: 'Katch-McArdle' };
}

export function cunningham({ mlgKg }) {
  return { value: 500 + 22 * mlgKg, source: 'Cunningham (1980)' };
}

// Schofield (1985) / FAO-WHO-UNU (1985) - equações pediátricas baseadas
// apenas em peso corporal, por faixa etária e sexo. Não usar Mifflin/Harris
// em crianças e adolescentes.
export function schofieldPediatrico({ peso, idade, sexo }) {
  let value;
  if (sexo === 'masculino') {
    if (idade < 3) value = 59.512 * peso - 30.4;
    else if (idade < 10) value = 22.706 * peso + 504.3;
    else value = 17.686 * peso + 658.2;
  } else {
    if (idade < 3) value = 58.317 * peso - 31.1;
    else if (idade < 10) value = 20.315 * peso + 485.9;
    else value = 13.384 * peso + 692.6;
  }
  return { value, source: 'Schofield / FAO-WHO-UNU (1985) — pediátrica' };
}

// Seleciona automaticamente a equação de TMB mais adequada à população/perfil.
// Regras da seção 7.1 do briefing do produto.
export function selectBmrEquation({ populacao, percentualGordura, sexo }) {
  if (populacao === 'crianca') return 'schofield';
  if (populacao === 'atleta') return 'katchMcArdle';
  if (percentualGordura != null) {
    const baixoLimiar = sexo === 'masculino' ? 12 : 20;
    if (percentualGordura <= baixoLimiar) return 'katchMcArdle';
  }
  return 'mifflinStJeor';
}

export function calcularTMB(equacao, dados) {
  switch (equacao) {
    case 'mifflinStJeor':
      return mifflinStJeor(dados);
    case 'harrisBenedict':
      return harrisBenedict(dados);
    case 'katchMcArdle':
      return katchMcArdle(dados);
    case 'cunningham':
      return cunningham(dados);
    case 'schofield':
      return schofieldPediatrico(dados);
    default:
      throw new Error(`Equação de TMB desconhecida: ${equacao}`);
  }
}

export function calcularGET(tmb, nivelAtividade) {
  const fator = ACTIVITY_FACTORS[nivelAtividade] ?? ACTIVITY_FACTORS.sedentario;
  return tmb * fator;
}

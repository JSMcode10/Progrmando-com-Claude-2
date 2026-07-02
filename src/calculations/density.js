// Fórmulas de densidade corporal e conversão para % de gordura.
// Cada função retorna { value, source } onde value é o resultado numérico
// e source é a citação do protocolo, para exibição obrigatória na UI.

import { DURNIN_WOMERSLEY_TABLE } from './constants.js';

const sum = (arr) => arr.reduce((a, b) => a + (Number(b) || 0), 0);

// --- Conversão Densidade -> %Gordura -------------------------------------

export function siri(density) {
  return { value: (4.95 / density - 4.5) * 100, source: 'Siri (1961)' };
}

export function brozek(density) {
  return { value: (4.57 / density - 4.142) * 100, source: 'Brozek et al. (1963)' };
}

// Lohman (1992) - constantes específicas por idade/sexo para conversão D -> %G,
// recomendado para crianças/adolescentes e idosos (densidade da massa livre de
// gordura varia com a maturação/idade). VALIDAR: confira as constantes C1/C2
// por sexo e faixa etária contra Lohman TG. Advances in Body Composition
// Assessment (1992) antes de uso profissional.
const LOHMAN_CONSTANTS = {
  crianca_menino: { c1: 5.30, c2: 4.89 },
  crianca_menina: { c1: 5.35, c2: 4.95 },
  idoso_masculino: { c1: 5.00, c2: 4.53 },
  idoso_feminino: { c1: 5.01, c2: 4.56 },
};

export function lohman(density, group) {
  const k = LOHMAN_CONSTANTS[group];
  if (!k) throw new Error(`Grupo Lohman desconhecido: ${group}`);
  return {
    value: (k.c1 / density - k.c2) * 100,
    source: 'Lohman (1992) — VALIDAR',
  };
}

export function densityToBodyFat(density, method = 'siri', lohmanGroup) {
  if (method === 'brozek') return brozek(density);
  if (method === 'lohman') return lohman(density, lohmanGroup);
  return siri(density);
}

// --- Jackson & Pollock / Jackson-Pollock-Ward -----------------------------

// 3 dobras, homens: peitoral, abdominal, coxa. Fonte: Jackson AS, Pollock ML
// (1978). British Journal of Nutrition, 40, 497-504.
export function jacksonPollock3Male({ peitoral, abdominal, coxa, idade }) {
  const s = sum([peitoral, abdominal, coxa]);
  const d = 1.10938 - 0.0008267 * s + 0.0000016 * s ** 2 - 0.0002574 * idade;
  return { density: d, sum: s, source: 'Jackson & Pollock 3 dobras (1978)' };
}

// 3 dobras, mulheres: tríceps, supra-ilíaca, coxa. Fonte: Jackson AS,
// Pollock ML, Ward A (1980). Medicine & Science in Sports & Exercise, 12, 175-182.
export function jacksonPollockWard3Female({ triceps, suprailiaca, coxa, idade }) {
  const s = sum([triceps, suprailiaca, coxa]);
  const d = 1.0994921 - 0.0009929 * s + 0.0000023 * s ** 2 - 0.0001392 * idade;
  return { density: d, sum: s, source: 'Jackson, Pollock & Ward 3 dobras (1980)' };
}

// 7 dobras, homens: subescapular, tríceps, peitoral, axilar média,
// supra-ilíaca, abdominal, coxa. Fonte: Jackson & Pollock (1978).
export function jacksonPollock7Male({
  subescapular,
  triceps,
  peitoral,
  axilarMedia,
  suprailiaca,
  abdominal,
  coxa,
  idade,
}) {
  const s = sum([subescapular, triceps, peitoral, axilarMedia, suprailiaca, abdominal, coxa]);
  const d = 1.112 - 0.00043499 * s + 0.00000055 * s ** 2 - 0.00028826 * idade;
  return { density: d, sum: s, source: 'Jackson & Pollock 7 dobras (1978)' };
}

// 7 dobras, mulheres: mesmos pontos anatômicos. Fonte: Jackson, Pollock &
// Ward (1980).
export function jacksonPollockWard7Female({
  subescapular,
  triceps,
  peitoral,
  axilarMedia,
  suprailiaca,
  abdominal,
  coxa,
  idade,
}) {
  const s = sum([subescapular, triceps, peitoral, axilarMedia, suprailiaca, abdominal, coxa]);
  const d = 1.097 - 0.00046971 * s + 0.00000056 * s ** 2 - 0.00012828 * idade;
  return { density: d, sum: s, source: 'Jackson, Pollock & Ward 7 dobras (1980)' };
}

// --- Durnin & Womersley (1974) - 4 dobras ---------------------------------
// Bíceps, tríceps, subescapular, supra-ilíaca. D = c - m*log10(sum4).
export function durninWomersley4({ biceps, triceps, subescapular, suprailiaca, idade, sexo }) {
  const s = sum([biceps, triceps, subescapular, suprailiaca]);
  const table = DURNIN_WOMERSLEY_TABLE[sexo];
  const band = table.find((b) => idade >= b.min && idade <= b.max) || table[table.length - 1];
  const d = band.c - band.m * Math.log10(s);
  return {
    density: d,
    sum: s,
    source: 'Durnin & Womersley 4 dobras (1974) — VALIDAR tabela de constantes',
  };
}

// --- Faulkner (1968) - 4 dobras --------------------------------------------
// Tríceps, subescapular, supra-ilíaca, abdominal. Fórmula direta em %G (não
// passa por densidade). Fonte: Faulkner JA (1968).
export function faulkner4({ triceps, subescapular, suprailiaca, abdominal }) {
  const s = sum([triceps, subescapular, suprailiaca, abdominal]);
  const pctG = s * 0.153 + 5.783;
  return { value: pctG, sum: s, source: 'Faulkner 4 dobras (1968)' };
}

// --- Slaughter et al. (1988) - crianças/adolescentes -----------------------
// Tríceps + panturrilha medial. Fórmula direta em %G.
export function slaughterTricepsCalf({ triceps, panturrilha, sexo }) {
  const s = sum([triceps, panturrilha]);
  const pctG = sexo === 'masculino' ? 0.735 * s + 1.0 : 0.61 * s + 5.1;
  return { value: pctG, sum: s, source: 'Slaughter et al. (1988) — tríceps+panturrilha' };
}

// Tríceps + subescapular, com ajuste por soma de dobras (versão simplificada,
// sem estágio de maturação sexual, pois o app não coleta esse dado clínico).
// VALIDAR: a equação original de Slaughter et al. (1988) para tríceps+
// subescapular é segmentada por estágio de maturação e etnia; aqui aplicamos
// a forma geral (>35mm) que deve ser conferida contra o artigo original.
export function slaughterTricepsSubscapular({ triceps, subescapular, sexo }) {
  const s = sum([triceps, subescapular]);
  let pctG;
  if (s <= 35) {
    pctG =
      sexo === 'masculino'
        ? 1.21 * s - 0.008 * s ** 2 - 1.7
        : 1.33 * s - 0.013 * s ** 2 - 2.5;
  } else {
    pctG = sexo === 'masculino' ? 0.783 * s + 1.6 : 0.546 * s + 9.7;
  }
  return { value: pctG, sum: s, source: 'Slaughter et al. (1988) — tríceps+subescapular — VALIDAR' };
}

// --- Petroski (1995) - equação brasileira -----------------------------------
// 4 dobras: tríceps, supra-ilíaca, abdominal, panturrilha medial (adaptação
// generalizada de Jackson & Pollock à população brasileira).
// VALIDAR: confira coeficientes contra Petroski EL. Desenvolvimento e
// validação de equações generalizadas para a estimativa da densidade
// corporal em adultos (1995), tese de doutorado, UFSM.
export function petroski4({ triceps, suprailiaca, abdominal, panturrilha, idade, sexo }) {
  const s = sum([triceps, suprailiaca, abdominal, panturrilha]);
  const d =
    sexo === 'masculino'
      ? 1.10726863 - 0.00081201 * s + 0.00000212 * s ** 2 - 0.00041761 * idade
      : 1.1954713 - 0.07513507 * Math.log10(s) - 0.00041072 * idade;
  return { density: d, sum: s, source: 'Petroski (1995) — VALIDAR' };
}

// --- Guedes (1985) - equação brasileira -------------------------------------
// 3 dobras: tríceps, subescapular, supra-ilíaca (homens); tríceps, supra-
// ilíaca, coxa (mulheres). VALIDAR: confira coeficientes contra Guedes DP.
// Estudo da gordura corporal através da mensuração dos valores de densidade
// corporal e da espessura de dobras cutâneas (1985), dissertação, UFSM.
export function guedes3({ triceps, subescapular, suprailiaca, coxa, sexo }) {
  if (sexo === 'masculino') {
    const s = sum([triceps, subescapular, suprailiaca]);
    const d = 1.1714 - 0.0671 * Math.log10(s);
    return { density: d, sum: s, source: 'Guedes (1985) — VALIDAR' };
  }
  const s = sum([triceps, suprailiaca, coxa]);
  const d = 1.1665 - 0.0706 * Math.log10(s);
  return { density: d, sum: s, source: 'Guedes (1985) — VALIDAR' };
}

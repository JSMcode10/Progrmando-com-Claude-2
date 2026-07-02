// Estimativa de massa muscular esquelética — Lee et al. (2000).
// IMPORTANTE: isto é uma ESTIMATIVA antropométrica, não uma medida direta.
// Massa livre de gordura (MLG) ≠ massa muscular: a MLG inclui osso, água
// corporal e vísceras, além do tecido muscular esquelético.
//
// VALIDAR: a equação abaixo reproduz a formulação geral publicada em
// Lee RC, Wang Z, Heo M, et al. "Total-body skeletal muscle mass:
// development and cross-validation of anthropometric prediction models."
// Am J Clin Nutr. 2000;72(3):796-803. Os coeficientes de correção das
// circunferências pelas dobras cutâneas (CAG, CCxG, CPG) e a constante de
// etnia devem ser conferidos contra o artigo original antes de uso
// profissional — foram reproduzidos de memória / fontes secundárias.

const SEX_CONSTANT = { masculino: 1, feminino: 0 };
// Constante de etnia: 0 para brancos/hispânicos (valor padrão neutro usado
// aqui na ausência de coleta de etnia no formulário).
const RACE_CONSTANT = 0;

export function skeletalMuscleMassLee({
  alturaCm,
  circunferenciaBracoCm,
  circunferenciaCoxaCm,
  circunferenciaPanturrilhaCm,
  tricepsMm,
  coxaMm,
  panturrilhaMm,
  idade,
  sexo,
}) {
  const alturaM = alturaCm / 100;

  // Circunferências corrigidas pela dobra cutânea correspondente (removendo
  // a espessura de tecido adiposo subcutâneo), convertendo mm -> cm (÷10).
  const cag = circunferenciaBracoCm - (Math.PI * (tricepsMm / 10));
  const ccxg = circunferenciaCoxaCm - (Math.PI * (coxaMm / 10));
  const cpg = circunferenciaPanturrilhaCm - (Math.PI * (panturrilhaMm / 10));

  const smKg =
    alturaM * (0.00744 * cag ** 2 + 0.00088 * ccxg ** 2 + 0.00441 * cpg ** 2) +
    2.4 * SEX_CONSTANT[sexo] -
    0.048 * idade +
    RACE_CONSTANT +
    7.8;

  return {
    value: smKg,
    source: 'Lee et al. (2000) — estimativa antropométrica — VALIDAR',
    label: 'Estimativa de massa muscular esquelética (não é medida direta)',
  };
}

import { IMC_RANGES, IMC_RANGE_IDOSO, BODY_FAT_REFERENCE } from './constants.js';

export function calcularIMC(peso, alturaCm) {
  const alturaM = alturaCm / 100;
  return peso / (alturaM * alturaM);
}

export function classificarIMC(imc) {
  const faixa = IMC_RANGES.find((r) => imc >= r.min && imc <= r.max);
  return { label: faixa ? faixa.label : 'Indefinido', source: 'OMS' };
}

// Faixa de peso saudável a partir do IMC 18,5-24,9 (23-28 para idosos,
// segundo Lipschitz 1994).
export function faixaPesoSaudavel(alturaCm, populacao) {
  const alturaM = alturaCm / 100;
  const range = populacao === 'idoso' ? IMC_RANGE_IDOSO : { min: 18.5, max: 24.9 };
  return {
    min: range.min * alturaM * alturaM,
    max: range.max * alturaM * alturaM,
    imcMin: range.min,
    imcMax: range.max,
  };
}

// Peso-alvo para atingir uma meta de %G, preservando a massa livre de gordura.
export function pesoAlvoPorMetaGordura(mlgKg, metaPercentualGordura) {
  const pesoAlvo = mlgKg / (1 - metaPercentualGordura / 100);
  return pesoAlvo;
}

export function classificarPercentualGordura(pctG, sexo) {
  const tabela = BODY_FAT_REFERENCE[sexo] || BODY_FAT_REFERENCE.masculino;
  const faixa = tabela.find((f) => pctG >= f.min && pctG <= f.max);
  return { label: faixa ? faixa.label : 'Indefinido', source: 'Referência ACE / Lohman (1992)' };
}

export function composicaoCorporal(peso, pctG) {
  const massaGorda = peso * (pctG / 100);
  const massaMagra = peso - massaGorda;
  return { massaGorda, massaMagra };
}

import {
  PROTOCOLOS,
  executarProtocolo,
  calcularIMC,
  classificarIMC,
  faixaPesoSaudavel,
  pesoAlvoPorMetaGordura,
  classificarPercentualGordura,
  composicaoCorporal,
  avaliarRiscoCardiovascular,
  selectBmrEquation,
  calcularTMB,
  calcularGET,
  ajustarCalorias,
  calcularMacros,
  skeletalMuscleMassLee,
  BODY_FAT_REFERENCE,
} from '../calculations/index.js';

function metaPercentualGordura(sexo) {
  const tabela = BODY_FAT_REFERENCE[sexo] || BODY_FAT_REFERENCE.masculino;
  const fitness = tabela.find((f) => f.label === 'Bom / Fitness');
  return fitness ? (fitness.min + fitness.max) / 2 : sexo === 'masculino' ? 15 : 22;
}

export function computeAssessment({ identificacao, populacao, protocolosSelecionados, dobras, circunferencias }) {
  const { sexo, idade: idadeStr, peso: pesoStr, alturaCm: alturaStr, nivelAtividade, objetivo } = identificacao;
  const idade = Number(idadeStr);
  const peso = Number(pesoStr);
  const alturaCm = Number(alturaStr);

  const numDobras = Object.fromEntries(Object.entries(dobras).map(([k, v]) => [k, Number(v)]));
  const numCirc = Object.fromEntries(Object.entries(circunferencias).map(([k, v]) => [k, Number(v) || undefined]));

  const protocolResults = protocolosSelecionados.map((id) => {
    const protocolo = PROTOCOLOS[id];
    const resultado = executarProtocolo(protocolo, { ...numDobras, idade, sexo });
    return { id, label: protocolo.label, ...resultado };
  });

  const pctGValues = protocolResults.map((r) => r.pctG);
  const pctGMedio = pctGValues.reduce((a, b) => a + b, 0) / pctGValues.length;
  const pctGMin = Math.min(...pctGValues);
  const pctGMax = Math.max(...pctGValues);

  const { massaGorda, massaMagra } = composicaoCorporal(peso, pctGMedio);

  const imc = calcularIMC(peso, alturaCm);
  const imcClass = classificarIMC(imc);
  const pesoSaudavel = faixaPesoSaudavel(alturaCm, populacao);

  const metaG = metaPercentualGordura(sexo);
  const pesoAlvo = pesoAlvoPorMetaGordura(massaMagra, metaG);

  const classificacaoPctG = classificarPercentualGordura(pctGMedio, sexo);

  const risco = avaliarRiscoCardiovascular({
    cintura: numCirc.cintura,
    quadril: numCirc.quadril,
    alturaCm,
    sexo,
    populacao,
    idade,
  });

  const equacaoTMB = selectBmrEquation({ populacao, percentualGordura: pctGMedio, sexo });
  const tmbResult = calcularTMB(equacaoTMB, { peso, alturaCm, idade, sexo, mlgKg: massaMagra });
  const get = calcularGET(tmbResult.value, nivelAtividade);
  const caloriasAjustadas = populacao !== 'crianca' ? ajustarCalorias(get, objetivo) : null;
  const obesidade = imc >= 30;
  const macros =
    populacao !== 'crianca' && caloriasAjustadas
      ? calcularMacros({ vct: caloriasAjustadas.target, peso, mlgKg: massaMagra, obesidade, objetivo })
      : null;

  let massaMuscular = null;
  if (
    numCirc.braco && numCirc.coxaCirc && numCirc.panturrilhaCirc &&
    numDobras.triceps && numDobras.coxa && numDobras.panturrilha
  ) {
    massaMuscular = skeletalMuscleMassLee({
      alturaCm,
      circunferenciaBracoCm: numCirc.braco,
      circunferenciaCoxaCm: numCirc.coxaCirc,
      circunferenciaPanturrilhaCm: numCirc.panturrilhaCirc,
      tricepsMm: numDobras.triceps,
      coxaMm: numDobras.coxa,
      panturrilhaMm: numDobras.panturrilha,
      idade,
      sexo,
    });
  }

  return {
    protocolResults,
    pctGMedio,
    pctGMin,
    pctGMax,
    dispersao: pctGMax - pctGMin,
    massaGorda,
    massaMagra,
    massaMuscular,
    imc,
    imcClass,
    pesoSaudavel,
    metaG,
    pesoAlvo,
    classificacaoPctG,
    risco,
    tmb: { ...tmbResult, equacao: equacaoTMB },
    get,
    caloriasAjustadas,
    macros,
    peso,
    alturaCm,
    idade,
    sexo,
  };
}

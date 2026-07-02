export * from './constants.js';
export * from './density.js';
export * from './bmr.js';
export * from './macros.js';
export * from './cardiovascular.js';
export * from './muscleMass.js';
export * from './classification.js';
export * from './recommendations.js';
export * from './protocolMeta.js';
export * from './heartRate.js';
export * from './vo2max.js';

import * as density from './density.js';

// Executa o protocolo selecionado e retorna sempre { pctG, source, sum? }.
export function executarProtocolo(protocolo, dados) {
  const fn = density[protocolo.calcKey];
  if (!fn) throw new Error(`Função de cálculo não encontrada: ${protocolo.calcKey}`);
  const resultado = fn(dados);

  if (protocolo.outputType === 'direct') {
    return { pctG: resultado.value, sum: resultado.sum, source: resultado.source };
  }

  // outputType === 'density': ainda precisa converter para %G (Siri por padrão).
  const conv = density.densityToBodyFat(resultado.density, dados.metodoConversao || 'siri', dados.lohmanGroup);
  return {
    pctG: conv.value,
    sum: resultado.sum,
    density: resultado.density,
    source: `${resultado.source} + ${conv.source}`,
  };
}

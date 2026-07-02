import { fmtPct, fmtKg, fmtKcal } from './format.js';

export function buildWhatsappMessage({ identificacao, result }) {
  const nome = identificacao.nome || 'Avaliado(a)';
  const linhas = [
    `*JSM Avaliação Pro* — Resumo de ${nome}`,
    `%G médio: ${fmtPct(result.pctGMedio)} (${result.classificacaoPctG.label})`,
    `Massa gorda: ${fmtKg(result.massaGorda)} · Massa magra: ${fmtKg(result.massaMagra)}`,
    `IMC: ${result.imc.toFixed(1)} (${result.imcClass.label})`,
    `TMB: ${fmtKcal(result.tmb.value)} · GET: ${fmtKcal(result.get)}`,
    '',
    'Relatório completo em PDF disponível com o profissional.',
  ];
  return linhas.join('\n');
}

export function buildWhatsappLink({ identificacao, result }, telefone) {
  const texto = encodeURIComponent(buildWhatsappMessage({ identificacao, result }));
  const numero = telefone ? telefone.replace(/\D/g, '') : '';
  return `https://wa.me/${numero}?text=${texto}`;
}

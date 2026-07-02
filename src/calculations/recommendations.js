// Motor de regras simples para orientação de treino e dieta, a partir de
// %G, objetivo, população e risco cardiovascular. Todo texto é orientativo
// e educativo — não substitui avaliação médica ou prescrição nutricional
// individualizada (atribuição do nutricionista, CFN).

function riscoElevado(risco) {
  if (!risco || !risco.aplicavel) return false;
  const niveis = [risco.cintura, risco.rcq, risco.rcest].filter(Boolean).map((r) => r.nivel);
  return niveis.includes('vermelho');
}

function limiarGorduraAlto(sexo) {
  return sexo === 'masculino' ? 25 : 32;
}

function limiarGorduraBaixo(sexo) {
  return sexo === 'masculino' ? 10 : 18;
}

export function gerarOrientacao({ populacao, pctG, sexo, objetivo, risco }) {
  const avisos = [];
  const treino = [];
  const dieta = [];

  if (populacao === 'crianca') {
    avisos.push(
      'Crianças e adolescentes: NÃO prescrever dieta restritiva. Priorize hábitos saudáveis e ludicidade.'
    );
    treino.push('Atividades lúdicas, esportes coletivos e brincadeiras ativas — foco em prazer pelo movimento, não em performance.');
    dieta.push('Sem prescrição dietética. Encaminhar a nutricionista/pediatra para orientação alimentar individualizada.');
    avisos.push('Encaminhar acompanhamento com pediatra para avaliação do crescimento e desenvolvimento.');
    return { avisos, treino, dieta };
  }

  const risco_elevado = riscoElevado(risco);
  const alto = pctG != null && pctG >= limiarGorduraAlto(sexo);
  const baixo = pctG != null && pctG <= limiarGorduraBaixo(sexo);

  if (populacao === 'idoso') {
    treino.push('Ênfase em treino de força (combate à sarcopenia) 2-3x/semana + exercícios de equilíbrio e mobilidade.');
    dieta.push('Proteína no teto da faixa recomendada (até ~2,0 g/kg) para preservação de massa muscular.');
    avisos.push('Protocolos clássicos de dobras cutâneas tendem a subestimar a gordura corporal no idoso — interprete com cautela.');
  }

  if (risco_elevado && (populacao === 'idoso' || populacao === 'adulto')) {
    treino.push('Priorizar treino aeróbio de baixo impacto + força leve a moderada 2-3x/semana.');
    dieta.push('Déficit calórico moderado (evitar restrições agressivas).');
    avisos.push('Risco cardiovascular elevado identificado — recomenda-se avaliação médica antes de treino de alta intensidade.');
  } else if (alto && objetivo === 'emagrecer') {
    treino.push('Treino de força full-body ou upper/lower, 3-5x/semana + condicionamento (HIIT ou LISS).');
    dieta.push('Déficit calórico de 15-20% do GET, com proteína alta para preservar massa livre de gordura.');
  } else if (baixo && objetivo === 'hipertrofia') {
    treino.push('Treino dividido por grupamento muscular (split), com volume progressivo e foco em sobrecarga.');
    dieta.push('Superávit calórico de 10-15% do GET, carboidrato mais concentrado no peri-treino.');
  } else if (objetivo === 'manter') {
    treino.push('Treino de força full-body 2-4x/semana, mantendo o padrão atual de atividade.');
    dieta.push('Ingestão calórica próxima ao GET, priorizando qualidade nutricional.');
  } else {
    treino.push('Treino de força combinado a condicionamento, ajustado ao nível atual de aptidão.');
    dieta.push('Ajuste calórico moderado conforme o objetivo (déficit/superávit de 10-20%).');
  }

  if (!risco_elevado && risco && risco.aplicavel) {
    const niveis = [risco.cintura, risco.rcq, risco.rcest].filter(Boolean).map((r) => r.nivel);
    if (niveis.includes('amarelo')) {
      avisos.push('Indicadores de risco cardiovascular em faixa intermediária — monitore periodicamente.');
    }
  }

  avisos.push(
    'A orientação de dieta/macros é uma referência educativa. A prescrição dietética individualizada é atribuição do nutricionista (CFN).'
  );
  avisos.push('Esta ferramenta é um apoio à decisão do profissional; não substitui avaliação médica.');

  return { avisos, treino, dieta };
}

// Metadados de protocolos: quais populações os habilitam e quais campos de
// dobras/circunferências cada um exige. Usado pela UI para montar o
// formulário dinamicamente (Etapa 2 e 3 do fluxo).

export const POPULACOES = [
  { id: 'crianca', label: 'Criança/Adolescente (7–17)', min: 7, max: 17 },
  { id: 'jovem', label: 'Jovem (18–29)', min: 18, max: 29 },
  { id: 'adulto', label: 'Adulto (30–59)', min: 30, max: 59 },
  { id: 'idoso', label: 'Idoso (60+)', min: 60, max: 120 },
  { id: 'atleta', label: 'Atleta', min: 7, max: 120 },
];

export const DOBRAS_LABELS = {
  triceps: 'Tríceps',
  biceps: 'Bíceps',
  subescapular: 'Subescapular',
  suprailiaca: 'Supra-ilíaca',
  abdominal: 'Abdominal',
  peitoral: 'Peitoral (torácica)',
  axilarMedia: 'Axilar média',
  coxa: 'Coxa',
  panturrilha: 'Panturrilha medial',
};

export const PROTOCOLOS = {
  jp3_masculino: {
    label: 'Jackson & Pollock 3 dobras (♂)',
    source: 'Jackson & Pollock (1978)',
    sexo: 'masculino',
    populacoes: ['jovem', 'adulto', 'atleta'],
    dobras: ['peitoral', 'abdominal', 'coxa'],
    outputType: 'density',
    calcKey: 'jacksonPollock3Male',
  },
  jpw3_feminino: {
    label: 'Jackson, Pollock & Ward 3 dobras (♀)',
    source: 'Jackson, Pollock & Ward (1980)',
    sexo: 'feminino',
    populacoes: ['jovem', 'adulto', 'atleta'],
    dobras: ['triceps', 'suprailiaca', 'coxa'],
    outputType: 'density',
    calcKey: 'jacksonPollockWard3Female',
  },
  jp7_masculino: {
    label: 'Jackson & Pollock 7 dobras (♂)',
    source: 'Jackson & Pollock (1978)',
    sexo: 'masculino',
    populacoes: ['jovem', 'adulto', 'atleta'],
    dobras: ['subescapular', 'triceps', 'peitoral', 'axilarMedia', 'suprailiaca', 'abdominal', 'coxa'],
    outputType: 'density',
    calcKey: 'jacksonPollock7Male',
  },
  jpw7_feminino: {
    label: 'Jackson, Pollock & Ward 7 dobras (♀)',
    source: 'Jackson, Pollock & Ward (1980)',
    sexo: 'feminino',
    populacoes: ['jovem', 'adulto', 'atleta'],
    dobras: ['subescapular', 'triceps', 'peitoral', 'axilarMedia', 'suprailiaca', 'abdominal', 'coxa'],
    outputType: 'density',
    calcKey: 'jacksonPollockWard7Female',
  },
  durnin_womersley: {
    label: 'Durnin & Womersley 4 dobras',
    source: 'Durnin & Womersley (1974) — VALIDAR',
    sexo: 'ambos',
    populacoes: ['jovem', 'adulto', 'idoso'],
    dobras: ['biceps', 'triceps', 'subescapular', 'suprailiaca'],
    outputType: 'density',
    calcKey: 'durninWomersley4',
  },
  petroski: {
    label: 'Petroski (brasileiro)',
    source: 'Petroski (1995) — VALIDAR',
    sexo: 'ambos',
    populacoes: ['jovem', 'adulto'],
    dobras: ['triceps', 'suprailiaca', 'abdominal', 'panturrilha'],
    outputType: 'density',
    calcKey: 'petroski4',
  },
  guedes: {
    label: 'Guedes (brasileiro)',
    source: 'Guedes (1985) — VALIDAR',
    sexo: 'ambos',
    populacoes: ['jovem', 'adulto'],
    dobras: ['triceps', 'subescapular', 'suprailiaca', 'coxa'],
    outputType: 'density',
    calcKey: 'guedes3',
  },
  faulkner: {
    label: 'Faulkner 4 dobras (rápido)',
    source: 'Faulkner (1968)',
    sexo: 'ambos',
    populacoes: ['jovem', 'adulto', 'atleta'],
    dobras: ['triceps', 'subescapular', 'suprailiaca', 'abdominal'],
    outputType: 'direct',
    calcKey: 'faulkner4',
  },
  slaughter_tricepspanturrilha: {
    label: 'Slaughter — tríceps + panturrilha',
    source: 'Slaughter et al. (1988)',
    sexo: 'ambos',
    populacoes: ['crianca'],
    dobras: ['triceps', 'panturrilha'],
    outputType: 'direct',
    calcKey: 'slaughterTricepsCalf',
  },
  slaughter_tricepssubescapular: {
    label: 'Slaughter — tríceps + subescapular',
    source: 'Slaughter et al. (1988) — VALIDAR',
    sexo: 'ambos',
    populacoes: ['crianca'],
    dobras: ['triceps', 'subescapular'],
    outputType: 'direct',
    calcKey: 'slaughterTricepsSubscapular',
  },
};

export function protocolosParaPopulacao(populacaoId) {
  return Object.entries(PROTOCOLOS)
    .filter(([, p]) => p.populacoes.includes(populacaoId))
    .map(([id, p]) => ({ id, ...p }));
}

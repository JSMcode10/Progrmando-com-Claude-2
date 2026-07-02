// Constantes e tabelas de referência usadas pelos protocolos.
// Toda constante marcada com "VALIDAR" deve ser conferida manualmente
// contra a publicação original antes de uso clínico/comercial.

export const ACTIVITY_FACTORS = {
  sedentario: 1.2,
  leve: 1.375,
  moderado: 1.55,
  intenso: 1.725,
  muito_intenso: 1.9,
};

export const ACTIVITY_LABELS = {
  sedentario: 'Sedentário',
  leve: 'Levemente ativo',
  moderado: 'Moderadamente ativo',
  intenso: 'Intenso',
  muito_intenso: 'Muito intenso',
};

// Durnin & Womersley (1974) - tabela de constantes c/m por sexo e faixa etária.
// Fonte: Durnin JVGA, Womersley J. British Journal of Nutrition, 32(1), 77-97.
// VALIDAR: confira estes 4 pares de constantes por sexo contra o artigo original
// antes de uso profissional — foram reproduzidas de memória / fontes secundárias.
export const DURNIN_WOMERSLEY_TABLE = {
  masculino: [
    { min: 17, max: 19, c: 1.1620, m: 0.0630 },
    { min: 20, max: 29, c: 1.1631, m: 0.0632 },
    { min: 30, max: 39, c: 1.1422, m: 0.0544 },
    { min: 40, max: 49, c: 1.1620, m: 0.0700 },
    { min: 50, max: 200, c: 1.1715, m: 0.0779 },
  ],
  feminino: [
    { min: 16, max: 19, c: 1.1549, m: 0.0678 },
    { min: 20, max: 29, c: 1.1599, m: 0.0717 },
    { min: 30, max: 39, c: 1.1423, m: 0.0632 },
    { min: 40, max: 49, c: 1.1333, m: 0.0612 },
    { min: 50, max: 200, c: 1.1339, m: 0.0645 },
  ],
};

// Faixas de %G de referência (sexo/idade), uso interpretativo geral.
// Fonte: adaptado de American Council on Exercise / Lohman (1992) - uso educativo.
export const BODY_FAT_REFERENCE = {
  masculino: [
    { label: 'Atlético', min: 6, max: 13 },
    { label: 'Bom / Fitness', min: 14, max: 17 },
    { label: 'Aceitável', min: 18, max: 24 },
    { label: 'Elevado', min: 25, max: 100 },
  ],
  feminino: [
    { label: 'Atlético', min: 14, max: 20 },
    { label: 'Bom / Fitness', min: 21, max: 24 },
    { label: 'Aceitável', min: 25, max: 31 },
    { label: 'Elevado', min: 32, max: 100 },
  ],
};

export const IMC_RANGES = [
  { label: 'Abaixo do peso', min: 0, max: 18.49 },
  { label: 'Peso normal', min: 18.5, max: 24.99 },
  { label: 'Sobrepeso', min: 25, max: 29.99 },
  { label: 'Obesidade grau I', min: 30, max: 34.99 },
  { label: 'Obesidade grau II', min: 35, max: 39.99 },
  { label: 'Obesidade grau III', min: 40, max: 999 },
];

// Idosos (60+): faixa de IMC recomendada é mais alta (Lipschitz, 1994).
export const IMC_RANGE_IDOSO = { min: 23, max: 28 };

export const WAIST_CUTOFFS = {
  masculino: { increased: 94, high: 102 },
  feminino: { increased: 80, high: 88 },
};

export const WHR_CUTOFFS = {
  masculino: 0.9,
  feminino: 0.85,
};

export const WHTR_CUTOFF = 0.5;

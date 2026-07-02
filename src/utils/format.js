// Formatação de números no padrão brasileiro (vírgula decimal).
export function fmtNumber(value, decimals = 1) {
  if (value == null || Number.isNaN(value)) return '—';
  return Number(value).toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function fmtPct(value, decimals = 1) {
  return `${fmtNumber(value, decimals)} %`;
}

export function fmtCm(value, decimals = 1) {
  return `${fmtNumber(value, decimals)} cm`;
}

export function fmtKg(value, decimals = 1) {
  return `${fmtNumber(value, decimals)} kg`;
}

export function fmtKcal(value) {
  return `${fmtNumber(value, 0)} kcal`;
}

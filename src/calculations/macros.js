// Ajuste calórico por objetivo e cálculo de macronutrientes de referência.
// Rotulado como orientação educativa — não substitui prescrição de nutricionista.

const GOAL_ADJUSTMENT = {
  emagrecer: { min: -0.2, max: -0.15 },
  manter: { min: 0, max: 0 },
  hipertrofia: { min: 0.1, max: 0.15 },
};

export function ajustarCalorias(get, objetivo) {
  const adj = GOAL_ADJUSTMENT[objetivo] ?? GOAL_ADJUSTMENT.manter;
  const min = get * (1 + adj.min);
  const max = get * (1 + adj.max);
  return { min: Math.min(min, max), max: Math.max(min, max), target: (min + max) / 2 };
}

// Proteína e gordura em g/kg de peso (ou de MLG, para obesos); carboidrato
// recebe o restante das calorias do VCT (valor calórico total).
export function calcularMacros({ vct, peso, mlgKg, obesidade, objetivo }) {
  const baseKg = obesidade && mlgKg ? mlgKg : peso;

  const proteinaGKgRange = objetivo === 'hipertrofia' ? [1.8, 2.2] : [1.6, 2.0];
  const proteinaGKg = (proteinaGKgRange[0] + proteinaGKgRange[1]) / 2;
  const proteinaG = proteinaGKg * baseKg;
  const proteinaKcal = proteinaG * 4;

  const gorduraGKg = 0.9;
  let gorduraG = gorduraGKg * peso;
  const gorduraKcalMin = vct * 0.2;
  if (gorduraG * 9 < gorduraKcalMin) gorduraG = gorduraKcalMin / 9;
  const gorduraKcal = gorduraG * 9;

  const carboKcal = Math.max(vct - proteinaKcal - gorduraKcal, 0);
  const carboG = carboKcal / 4;

  return {
    proteina: { g: proteinaG, kcal: proteinaKcal, pct: (proteinaKcal / vct) * 100, gPorKg: proteinaGKg },
    gordura: { g: gorduraG, kcal: gorduraKcal, pct: (gorduraKcal / vct) * 100, gPorKg: gorduraG / peso },
    carboidrato: { g: carboG, kcal: carboKcal, pct: (carboKcal / vct) * 100 },
    vct,
  };
}

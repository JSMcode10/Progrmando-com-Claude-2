import { describe, it, expect } from 'vitest';
import {
  jacksonPollock3Male,
  faulkner4,
  siri,
  brozek,
  densityToBodyFat,
} from '../density.js';
import { mifflinStJeor, calcularGET } from '../bmr.js';
import { calcularIMC, classificarIMC } from '../classification.js';
import { calcularRCEst, classificarRCEst } from '../cardiovascular.js';

describe('Jackson & Pollock 3 dobras (homens)', () => {
  it('calcula densidade e %G (Siri) para valores conhecidos', () => {
    const { density, sum } = jacksonPollock3Male({
      peitoral: 10,
      abdominal: 15,
      coxa: 12,
      idade: 30,
    });
    expect(sum).toBe(37);
    expect(density).toBeCloseTo(1.07326, 4);
    const { value } = densityToBodyFat(density, 'siri');
    expect(value).toBeCloseTo(11.21, 1);
  });
});

describe('Faulkner 4 dobras', () => {
  it('calcula %G diretamente da soma das dobras', () => {
    const { value, sum } = faulkner4({
      triceps: 10,
      subescapular: 10,
      suprailiaca: 10,
      abdominal: 10,
    });
    expect(sum).toBe(40);
    expect(value).toBeCloseTo(11.903, 3);
  });
});

describe('Conversão densidade -> %G', () => {
  it('Siri (1961)', () => {
    expect(siri(1.05).value).toBeCloseTo(21.4286, 3);
  });
  it('Brozek (1963)', () => {
    expect(brozek(1.05).value).toBeCloseTo(21.0381, 3);
  });
});

describe('TMB Mifflin-St Jeor', () => {
  it('homem 80kg/180cm/30anos', () => {
    expect(mifflinStJeor({ peso: 80, alturaCm: 180, idade: 30, sexo: 'masculino' }).value).toBeCloseTo(1780, 5);
  });
  it('mulher 60kg/165cm/25anos', () => {
    expect(mifflinStJeor({ peso: 60, alturaCm: 165, idade: 25, sexo: 'feminino' }).value).toBeCloseTo(1345.25, 5);
  });
  it('GET aplica fator de atividade moderado', () => {
    expect(calcularGET(1780, 'moderado')).toBeCloseTo(1780 * 1.55, 5);
  });
});

describe('IMC', () => {
  it('classifica peso normal', () => {
    const imc = calcularIMC(70, 175);
    expect(imc).toBeCloseTo(22.857, 2);
    expect(classificarIMC(imc).label).toBe('Peso normal');
  });
});

describe('Relação Cintura-Estatura', () => {
  it('sinaliza risco quando >= 0.5', () => {
    const rcest = calcularRCEst(90, 170).value;
    expect(rcest).toBeCloseTo(0.5294, 3);
    expect(classificarRCEst(rcest).nivel).toBe('vermelho');
  });
  it('sem risco quando < 0.5', () => {
    const rcest = calcularRCEst(70, 175).value;
    expect(classificarRCEst(rcest).nivel).toBe('verde');
  });
});

import { describe, it, expect } from 'vitest';
import { fcMaxTanaka, fcMaxGulati, fcMaxFox, zonasPorPercentual, zonasKarvonen } from '../heartRate.js';
import { cooper12min, rockport1Milha, queensCollegeStep } from '../vo2max.js';

describe('FC Máxima', () => {
  it('Tanaka (2001) para 30 anos', () => {
    expect(fcMaxTanaka(30).value).toBeCloseTo(187, 5);
  });
  it('Gulati (2010) para 30 anos', () => {
    expect(fcMaxGulati(30).value).toBeCloseTo(179.6, 5);
  });
  it('Fox (220-idade) para 30 anos', () => {
    expect(fcMaxFox(30).value).toBe(190);
  });
});

describe('Zonas de FC', () => {
  it('calcula bpm por %FCmax', () => {
    const zonas = zonasPorPercentual(190);
    expect(zonas[1].id).toBe('Z2');
    expect(zonas[1].bpmMin).toBe(114); // 190*0.6
    expect(zonas[1].bpmMax).toBe(133); // 190*0.7
  });
  it('calcula bpm por Karvonen (FC reserva)', () => {
    const zonas = zonasKarvonen(190, 60);
    // reserva = 130; Z2 60-70%: 130*0.6+60=138, 130*0.7+60=151
    expect(zonas[1].bpmMin).toBe(138);
    expect(zonas[1].bpmMax).toBe(151);
  });
});

describe('VO2máx - testes de campo', () => {
  it('Cooper 12 min', () => {
    expect(cooper12min({ distanciaMetros: 2400 }).value).toBeCloseTo(42.35, 1);
  });
  it('Rockport 1 milha', () => {
    const { value } = rockport1Milha({ pesoKg: 80, idade: 30, sexo: 'masculino', tempoMin: 13, fcFinal: 140 });
    expect(value).toBeCloseTo(49.62, 1);
  });
  it('Queens College Step Test (homens)', () => {
    expect(queensCollegeStep({ fcRecuperacao: 140, sexo: 'masculino' }).value).toBeCloseTo(52.53, 1);
  });
  it('Queens College Step Test (mulheres)', () => {
    expect(queensCollegeStep({ fcRecuperacao: 150, sexo: 'feminino' }).value).toBeCloseTo(38.105, 2);
  });
});

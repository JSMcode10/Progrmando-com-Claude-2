import { useEffect, useMemo, useState } from 'react';
import { cooper12min, rockport1Milha, queensCollegeStep, sugerirTesteVO2, classificarVO2max, orientacaoVO2 } from '../../calculations/vo2max.js';
import { fmtNumber } from '../../utils/format.js';

const TESTES = [
  { id: 'cooper', label: 'Cooper — 12 minutos', desc: 'Condicionados/atletas — corrida contínua de 12 min' },
  { id: 'rockport', label: 'Rockport — 1 milha (caminhada)', desc: 'Iniciantes, idosos, restrição articular — submáximo' },
  { id: 'queens', label: 'Queens College Step Test', desc: 'Precisa só de um degrau (~41,3 cm), 3 minutos' },
];

const NIVEL_BADGE = {
  'Muito fraco': 'jsm-badge-red',
  Fraco: 'jsm-badge-red',
  Regular: 'jsm-badge-yellow',
  Bom: 'jsm-badge-green',
  Excelente: 'jsm-badge-green',
  Superior: 'jsm-badge-green',
};

export default function StepVO2({ idade, sexo, peso, populacao, riscoElevado, onResultChange }) {
  const sugestao = useMemo(() => sugerirTesteVO2({ populacao, espacoReduzido: false }), [populacao]);
  const [teste, setTeste] = useState(sugestao);
  const [distanciaMetros, setDistanciaMetros] = useState('');
  const [tempoMin, setTempoMin] = useState('');
  const [fcFinal, setFcFinal] = useState('');
  const [fcRecuperacao, setFcRecuperacao] = useState('');

  let resultado = null;
  if (teste === 'cooper' && distanciaMetros) {
    resultado = cooper12min({ distanciaMetros: Number(distanciaMetros) });
  } else if (teste === 'rockport' && tempoMin && fcFinal && peso && idade) {
    resultado = rockport1Milha({ pesoKg: Number(peso), idade: Number(idade), sexo, tempoMin: Number(tempoMin), fcFinal: Number(fcFinal) });
  } else if (teste === 'queens' && fcRecuperacao) {
    resultado = queensCollegeStep({ fcRecuperacao: Number(fcRecuperacao), sexo });
  }

  const classificacao = resultado ? classificarVO2max(resultado.value, Number(idade), sexo) : null;
  const orientacao = classificacao ? orientacaoVO2({ categoria: classificacao.categoria, riscoElevado }) : null;

  useEffect(() => {
    onResultChange?.(
      resultado
        ? { teste, value: resultado.value, source: resultado.source, categoria: classificacao?.categoria, orientacao }
        : null
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teste, resultado?.value, classificacao?.categoria]);

  return (
    <div className="space-y-6">
      <div className="bg-jsm-gold/10 border border-jsm-gold/30 rounded-xl px-4 py-3 text-xs text-jsm-gold/90">
        VO2máx por teste de campo é uma estimativa indireta — a medida direta é a ergoespirometria.
      </div>

      <div className="jsm-card">
        <h3 className="text-lg mb-1">Escolha do teste</h3>
        <p className="jsm-label text-xs mb-4">
          Sugestão para este perfil: <span className="text-jsm-teal">{TESTES.find((t) => t.id === sugestao)?.label}</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TESTES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTeste(t.id)}
              className={`rounded-xl p-4 text-left border-2 transition ${
                teste === t.id ? 'border-jsm-teal bg-jsm-teal/10' : 'border-white/10 bg-black/20 hover:border-white/30'
              }`}
            >
              <div className="font-semibold text-sm">{t.label}</div>
              <div className="jsm-label text-xs mt-1">{t.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="jsm-card">
        <h3 className="text-lg mb-4">Dados do teste</h3>
        {teste === 'cooper' && (
          <div>
            <label className="jsm-label">Distância percorrida em 12 min (m)</label>
            <input type="number" className="jsm-input mt-1 max-w-xs" value={distanciaMetros} onChange={(e) => setDistanciaMetros(e.target.value)} />
          </div>
        )}
        {teste === 'rockport' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="jsm-label">Tempo para 1 milha (1609 m), em minutos</label>
              <input type="number" step="0.01" className="jsm-input mt-1" value={tempoMin} onChange={(e) => setTempoMin(e.target.value)} />
            </div>
            <div>
              <label className="jsm-label">FC ao final do teste (bpm)</label>
              <input type="number" className="jsm-input mt-1" value={fcFinal} onChange={(e) => setFcFinal(e.target.value)} />
            </div>
          </div>
        )}
        {teste === 'queens' && (
          <div>
            <label className="jsm-label">FC de recuperação (5–20s após 3 min de degrau: ♂24/min · ♀22/min)</label>
            <input type="number" className="jsm-input mt-1 max-w-xs" value={fcRecuperacao} onChange={(e) => setFcRecuperacao(e.target.value)} />
          </div>
        )}
      </div>

      {resultado && (
        <div className="jsm-card">
          <h3 className="text-lg mb-4">Resultado</h3>
          <div className="bg-black/20 rounded-lg p-4 mb-3">
            <div className="jsm-label text-sm">{resultado.source}</div>
            <div className="text-3xl font-serif text-jsm-teal">{fmtNumber(resultado.value, 1)} ml/kg/min</div>
          </div>
          {classificacao && (
            <div className="flex items-center gap-2 mb-3">
              <span className={NIVEL_BADGE[classificacao.categoria]}>{classificacao.categoria}</span>
              <span className="jsm-label text-xs">{classificacao.source}</span>
            </div>
          )}
          {orientacao && (
            <div>
              <p className="text-sm mb-2">{orientacao.texto}</p>
              {orientacao.avisos.map((a, i) => (
                <p key={i} className="text-xs text-jsm-gold/90">⚠ {a}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { calcularFcMax, compararFcMax, zonasPorPercentual, zonasKarvonen, orientacaoFC } from '../../calculations/heartRate.js';
import { fmtNumber } from '../../utils/format.js';

export default function StepFC({ idade, sexo, objetivo, populacao, riscoElevado, onResultChange }) {
  const [equacao, setEquacao] = useState('tanaka');
  const [fcRepouso, setFcRepouso] = useState('');
  const [comparar, setComparar] = useState(false);

  const fcMax = useMemo(() => calcularFcMax(equacao, idade), [equacao, idade]);
  const comparacao = useMemo(() => compararFcMax(idade), [idade]);
  const zonas = useMemo(() => zonasPorPercentual(fcMax.value), [fcMax]);
  const fcRepousoNum = Number(fcRepouso) || null;
  const zonasReserva = useMemo(
    () => (fcRepousoNum ? zonasKarvonen(fcMax.value, fcRepousoNum) : null),
    [fcMax, fcRepousoNum]
  );
  const orientacao = useMemo(
    () => orientacaoFC({ objetivo, populacao, riscoElevado }),
    [objetivo, populacao, riscoElevado]
  );

  useEffect(() => {
    onResultChange?.({
      equacao,
      fcMax: fcMax.value,
      fcMaxSource: fcMax.source,
      fcRepouso: fcRepousoNum,
      zonas,
      zonasReserva,
      orientacao,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [equacao, fcMax, fcRepousoNum, zonas, zonasReserva]);

  return (
    <div className="space-y-6">
      <div className="bg-jsm-gold/10 border border-jsm-gold/30 rounded-xl px-4 py-3 text-xs text-jsm-gold/90">
        FCmax e zonas são estimativas por equação de regressão — variabilidade interindividual grande;
        não substituem teste ergométrico/ergoespirometria.
      </div>

      <div className="jsm-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg">Frequência cardíaca máxima estimada</h3>
          <button className="jsm-btn-secondary text-xs" onClick={() => setComparar((v) => !v)}>
            {comparar ? 'Ocultar comparação' : 'Comparar equações'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="jsm-label">Equação de FCmax</label>
            <select className="jsm-input mt-1" value={equacao} onChange={(e) => setEquacao(e.target.value)}>
              <option value="tanaka">Tanaka et al. (2001) — padrão recomendado</option>
              <option value="gulati">Gulati et al. (2010) — mulheres</option>
              <option value="fox">Fox (220−idade) — comparativo</option>
            </select>
          </div>
          <div>
            <label className="jsm-label">FC de repouso (opcional, habilita Karvonen)</label>
            <input type="number" className="jsm-input mt-1" value={fcRepouso} onChange={(e) => setFcRepouso(e.target.value)} placeholder="bpm" />
          </div>
        </div>

        <div className="bg-black/20 rounded-lg p-4 mb-3">
          <div className="jsm-label text-sm">{fcMax.source}</div>
          <div className="text-3xl font-serif text-jsm-teal">{fmtNumber(fcMax.value, 0)} bpm</div>
        </div>

        {comparar && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Object.entries(comparacao).map(([key, r]) => (
              <div key={key} className="bg-black/20 rounded-lg p-3">
                <div className="text-xl font-serif">{fmtNumber(r.value, 0)} bpm</div>
                <div className="jsm-label text-[11px] mt-1">{r.source}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="jsm-card">
        <h3 className="text-lg mb-1">Zonas de treino (% FCmax)</h3>
        <p className="jsm-label text-xs mb-4">Faixas em bpm calculadas sobre a FCmax selecionada acima.</p>
        <div className="space-y-2">
          {zonas.map((z) => (
            <div key={z.id} className="flex items-center justify-between bg-black/20 rounded-lg px-4 py-2">
              <div>
                <span className="font-semibold text-jsm-teal">{z.id}</span>{' '}
                <span className="jsm-label text-sm">({fmtNumber(z.pctMin * 100, 0)}–{fmtNumber(z.pctMax * 100, 0)}%)</span>
                <div className="text-xs jsm-label">{z.foco}</div>
              </div>
              <div className="text-lg">{z.bpmMin}–{z.bpmMax} bpm</div>
            </div>
          ))}
        </div>
      </div>

      {zonasReserva && (
        <div className="jsm-card">
          <h3 className="text-lg mb-1">Zonas por Karvonen (FC de reserva)</h3>
          <p className="jsm-label text-xs mb-4">
            Diferente do %FCmax simples, o Karvonen considera a FC de repouso, sendo mais individualizado.
          </p>
          <div className="space-y-2">
            {zonasReserva.map((z) => (
              <div key={z.id} className="flex items-center justify-between bg-black/20 rounded-lg px-4 py-2">
                <div>
                  <span className="font-semibold text-jsm-gold">{z.id}</span>{' '}
                  <span className="jsm-label text-sm">({fmtNumber(z.pctMin * 100, 0)}–{fmtNumber(z.pctMax * 100, 0)}%)</span>
                </div>
                <div className="text-lg">{z.bpmMin}–{z.bpmMax} bpm</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="jsm-card">
        <h3 className="text-lg mb-2">Orientação</h3>
        <p className="text-sm mb-2">{orientacao.texto}</p>
        {orientacao.avisos.map((a, i) => (
          <p key={i} className="text-xs text-jsm-gold/90">⚠ {a}</p>
        ))}
      </div>
    </div>
  );
}

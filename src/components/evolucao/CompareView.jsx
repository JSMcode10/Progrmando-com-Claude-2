import { useState } from 'react';
import { PARAM_DEFS, resolveDirection, classificarDelta } from '../../utils/evolutionParams.js';
import { fmtNumber } from '../../utils/format.js';

const DELTA_COLOR = {
  verde: 'text-emerald-400',
  vermelho: 'text-rose-400',
  neutro: 'text-jsm-label',
};

function formatDate(d) {
  return new Date(d).toLocaleDateString('pt-BR');
}

export default function CompareView({ avaliacoes, objetivo, onClose }) {
  const ordenadas = [...avaliacoes].sort((a, b) => new Date(a.data_avaliacao) - new Date(b.data_avaliacao));
  const [antesId, setAntesId] = useState(ordenadas[0]?.id);
  const [depoisId, setDepoisId] = useState(ordenadas[ordenadas.length - 1]?.id);

  const antes = avaliacoes.find((a) => a.id === antesId);
  const depois = avaliacoes.find((a) => a.id === depoisId);

  return (
    <div className="jsm-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl">Comparativo antes / depois</h3>
        <button className="jsm-btn-secondary text-xs" onClick={onClose}>Fechar</button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="jsm-label">Antes</label>
          <select className="jsm-input mt-1" value={antesId} onChange={(e) => setAntesId(e.target.value)}>
            {ordenadas.map((a) => (
              <option key={a.id} value={a.id}>{formatDate(a.data_avaliacao)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="jsm-label">Depois</label>
          <select className="jsm-input mt-1" value={depoisId} onChange={(e) => setDepoisId(e.target.value)}>
            {ordenadas.map((a) => (
              <option key={a.id} value={a.id}>{formatDate(a.data_avaliacao)}</option>
            ))}
          </select>
        </div>
      </div>

      {antes && depois && (
        <div className="space-y-2">
          {PARAM_DEFS.map((def) => {
            const v1 = def.extract(antes);
            const v2 = def.extract(depois);
            if (v1 == null || v2 == null) return null;
            const delta = v2 - v1;
            const direction = resolveDirection(def.key, objetivo);
            const { cor } = classificarDelta(delta, direction);
            return (
              <div key={def.key} className="grid grid-cols-4 items-center gap-2 bg-black/20 rounded-lg px-4 py-2 text-sm">
                <div className="jsm-label">{def.label}</div>
                <div className="text-right">{fmtNumber(v1, def.decimals)} {def.unit}</div>
                <div className="text-right">{fmtNumber(v2, def.decimals)} {def.unit}</div>
                <div className={`text-right font-semibold ${DELTA_COLOR[cor]}`}>
                  {delta > 0 ? '▲' : delta < 0 ? '▼' : '—'} {fmtNumber(Math.abs(delta), def.decimals)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

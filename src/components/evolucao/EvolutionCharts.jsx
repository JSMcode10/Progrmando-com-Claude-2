import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PARAM_DEFS, resolveDirection, classificarDelta } from '../../utils/evolutionParams.js';
import { fmtNumber } from '../../utils/format.js';

const DELTA_COLOR = {
  verde: 'text-emerald-400',
  vermelho: 'text-rose-400',
  neutro: 'text-jsm-label',
};

const DEFAULT_SELECIONADOS = ['peso', 'pctG'];

function formatDate(d) {
  return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

export default function EvolutionCharts({ avaliacoesAsc, objetivo }) {
  const [selecionados, setSelecionados] = useState(DEFAULT_SELECIONADOS);

  const toggle = (key) => {
    setSelecionados((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  if (avaliacoesAsc.length < 1) {
    return <p className="jsm-label text-sm">Sem avaliações suficientes para gerar gráficos de evolução.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {PARAM_DEFS.map((p) => (
          <button
            key={p.key}
            onClick={() => toggle(p.key)}
            className={`text-xs rounded-full px-3 py-1.5 border transition ${
              selecionados.includes(p.key)
                ? 'border-jsm-teal bg-jsm-teal/15 text-jsm-teal'
                : 'border-white/15 text-jsm-label hover:border-white/30'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {avaliacoesAsc.length < 2 && (
        <p className="jsm-label text-sm">Apenas 1 avaliação registrada — o gráfico de evolução aparece a partir da 2ª.</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {selecionados.map((key) => {
          const def = PARAM_DEFS.find((p) => p.key === key);
          const pontos = avaliacoesAsc
            .map((a) => ({ data: formatDate(a.data_avaliacao), valor: def.extract(a) }))
            .filter((p) => p.valor != null);

          if (pontos.length === 0) {
            return (
              <div key={key} className="jsm-card">
                <h4 className="text-sm mb-2">{def.label}</h4>
                <p className="jsm-label text-xs">Sem dados registrados para este parâmetro.</p>
              </div>
            );
          }

          const primeiro = pontos[0].valor;
          const ultimo = pontos[pontos.length - 1].valor;
          const delta = ultimo - primeiro;
          const direction = resolveDirection(key, objetivo);
          const { cor } = classificarDelta(delta, direction);

          return (
            <div key={key} className="jsm-card">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm">{def.label}</h4>
                {pontos.length > 1 && (
                  <span className={`text-sm font-semibold ${DELTA_COLOR[cor]}`}>
                    {delta > 0 ? '▲' : delta < 0 ? '▼' : '—'} {fmtNumber(Math.abs(delta), def.decimals)} {def.unit}
                  </span>
                )}
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={pontos} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="data" stroke="#9CA8B3" fontSize={11} />
                  <YAxis stroke="#9CA8B3" fontSize={11} domain={['auto', 'auto']} />
                  <Tooltip
                    contentStyle={{ background: '#151A1F', border: '1px solid #ffffff20', fontSize: 12 }}
                    formatter={(v) => [`${fmtNumber(v, def.decimals)} ${def.unit}`, def.label]}
                  />
                  <Line type="monotone" dataKey="valor" stroke="#00D9C0" strokeWidth={2} dot={{ r: 3, fill: '#F2C14E' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          );
        })}
      </div>
    </div>
  );
}

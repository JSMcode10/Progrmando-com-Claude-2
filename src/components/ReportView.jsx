import { forwardRef } from 'react';
import { fmtNumber, fmtPct, fmtKg, fmtKcal } from '../utils/format.js';

const ReportView = forwardRef(function ReportView(
  { identificacao, result, orientacao, logoDataUrl, ctaText },
  ref
) {
  const { protocolResults, pctGMedio, massaGorda, massaMagra, massaMuscular, imc, imcClass, tmb, get, macros, classificacaoPctG, risco } = result;

  return (
    <div ref={ref} className="bg-jsm-bg text-white p-6 rounded-2xl border border-white/10 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-serif text-jsm-teal">JSM Avaliação Pro</h1>
          <p className="jsm-label text-xs">Relatório de avaliação física e composição corporal</p>
        </div>
        {logoDataUrl && <img src={logoDataUrl} alt="Logo do profissional" className="h-14 object-contain" />}
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm mb-6">
        <div><span className="jsm-label">Nome:</span> {identificacao.nome || '—'}</div>
        <div><span className="jsm-label">Data:</span> {new Date().toLocaleDateString('pt-BR')}</div>
        <div><span className="jsm-label">Sexo:</span> {identificacao.sexo}</div>
        <div><span className="jsm-label">Idade:</span> {identificacao.idade} anos</div>
        <div><span className="jsm-label">Peso:</span> {fmtKg(Number(identificacao.peso))}</div>
        <div><span className="jsm-label">Estatura:</span> {identificacao.alturaCm} cm</div>
      </div>

      <h2 className="font-serif text-lg text-jsm-gold mb-2">Composição corporal</h2>
      <div className="text-sm space-y-1 mb-4">
        {protocolResults.map((r) => (
          <div key={r.id} className="flex justify-between">
            <span>{r.label}</span>
            <span>{fmtPct(r.pctG)}</span>
          </div>
        ))}
        <div className="flex justify-between font-semibold pt-1 border-t border-white/10">
          <span>%G médio ({classificacaoPctG.label})</span>
          <span className="text-jsm-teal">{fmtPct(pctGMedio)}</span>
        </div>
        <div className="flex justify-between"><span>Massa gorda</span><span>{fmtKg(massaGorda)}</span></div>
        <div className="flex justify-between"><span>Massa livre de gordura</span><span>{fmtKg(massaMagra)}</span></div>
        {massaMuscular && (
          <div className="flex justify-between"><span>Massa muscular (estimativa)</span><span>{fmtKg(massaMuscular.value)}</span></div>
        )}
        <div className="flex justify-between"><span>IMC</span><span>{fmtNumber(imc, 1)} — {imcClass.label}</span></div>
      </div>

      {risco.aplicavel && (
        <>
          <h2 className="font-serif text-lg text-jsm-gold mb-2">Risco cardiovascular</h2>
          <div className="text-sm space-y-1 mb-4">
            {risco.cintura && <div className="flex justify-between"><span>Cintura</span><span>{fmtNumber(risco.cintura.value, 1)} cm — {risco.cintura.texto}</span></div>}
            {risco.rcq && <div className="flex justify-between"><span>RCQ</span><span>{fmtNumber(risco.rcq.value, 2)} — {risco.rcq.texto}</span></div>}
            {risco.rcest && <div className="flex justify-between"><span>RCEst</span><span>{fmtNumber(risco.rcest.value, 2)} — {risco.rcest.texto}</span></div>}
          </div>
        </>
      )}

      <h2 className="font-serif text-lg text-jsm-gold mb-2">Gasto energético</h2>
      <div className="text-sm space-y-1 mb-4">
        <div className="flex justify-between"><span>TMB ({tmb.source})</span><span>{fmtKcal(tmb.value)}</span></div>
        <div className="flex justify-between"><span>GET</span><span>{fmtKcal(get)}</span></div>
        {macros && (
          <>
            <div className="flex justify-between"><span>Proteína</span><span>{fmtNumber(macros.proteina.g, 0)} g/dia</span></div>
            <div className="flex justify-between"><span>Gordura</span><span>{fmtNumber(macros.gordura.g, 0)} g/dia</span></div>
            <div className="flex justify-between"><span>Carboidrato</span><span>{fmtNumber(macros.carboidrato.g, 0)} g/dia</span></div>
          </>
        )}
      </div>

      <h2 className="font-serif text-lg text-jsm-gold mb-2">Orientação</h2>
      <div className="text-sm space-y-2 mb-4">
        <div>
          <p className="jsm-label mb-1">Treino</p>
          <ul className="list-disc list-inside space-y-0.5">{orientacao.treino.map((t, i) => <li key={i}>{t}</li>)}</ul>
        </div>
        <div>
          <p className="jsm-label mb-1">Dieta (referência educativa)</p>
          <ul className="list-disc list-inside space-y-0.5">{orientacao.dieta.map((t, i) => <li key={i}>{t}</li>)}</ul>
        </div>
        <div className="text-xs text-jsm-gold/80 space-y-0.5 pt-2 border-t border-white/10">
          {orientacao.avisos.map((a, i) => <p key={i}>⚠ {a}</p>)}
        </div>
      </div>

      {ctaText && (
        <div className="mt-6 text-center bg-jsm-teal/10 border border-jsm-teal/30 rounded-xl p-3 text-sm text-jsm-teal font-semibold">
          {ctaText}
        </div>
      )}
    </div>
  );
});

export default ReportView;

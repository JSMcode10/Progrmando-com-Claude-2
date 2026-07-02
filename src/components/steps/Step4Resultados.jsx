import { fmtNumber, fmtPct, fmtKg, fmtCm, fmtKcal } from '../../utils/format.js';

const NIVEL_BADGE = {
  verde: 'jsm-badge-green',
  amarelo: 'jsm-badge-yellow',
  vermelho: 'jsm-badge-red',
};

function RiscoLinha({ label, dado }) {
  if (!dado) return null;
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <span className="jsm-label text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm">{fmtNumber(dado.value, 2)}</span>
        <span className={NIVEL_BADGE[dado.nivel]}>{dado.texto}</span>
      </div>
    </div>
  );
}

export default function Step4Resultados({ result, onBack, onNext }) {
  const {
    protocolResults, pctGMedio, pctGMin, pctGMax, dispersao,
    massaGorda, massaMagra, massaMuscular, imc, imcClass,
    pesoSaudavel, pesoAlvo, metaG, classificacaoPctG, risco,
    tmb, get, caloriasAjustadas, macros, peso,
  } = result;

  const combinado = protocolResults.length > 1;

  return (
    <div className="space-y-6">
      <div className="jsm-card">
        <h2 className="text-xl mb-4">% de gordura corporal</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {protocolResults.map((r) => (
            <div key={r.id} className="bg-black/20 rounded-lg p-3">
              <div className="text-2xl text-jsm-teal font-serif">{fmtPct(r.pctG)}</div>
              <div className="jsm-label text-xs mt-1">{r.label}</div>
              <div className="jsm-label text-[11px] mt-1">{r.source}</div>
            </div>
          ))}
        </div>
        {combinado && (
          <div className="bg-jsm-teal/10 border border-jsm-teal/30 rounded-lg p-3 text-sm">
            Média: <span className="text-jsm-teal font-semibold">{fmtPct(pctGMedio)}</span> · Intervalo:{' '}
            {fmtPct(pctGMin)} – {fmtPct(pctGMax)} · Dispersão entre protocolos: {fmtPct(dispersao)}
          </div>
        )}
        <div className="mt-3">
          <span className="jsm-badge-yellow">{classificacaoPctG.label}</span>
          <span className="jsm-label text-xs ml-2">{classificacaoPctG.source}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="jsm-card">
          <div className="jsm-label text-sm">Massa gorda</div>
          <div className="text-2xl font-serif text-white">{fmtKg(massaGorda)}</div>
        </div>
        <div className="jsm-card">
          <div className="jsm-label text-sm">Massa livre de gordura</div>
          <div className="text-2xl font-serif text-white">{fmtKg(massaMagra)}</div>
        </div>
        <div className="jsm-card">
          <div className="jsm-label text-sm">Massa muscular esquelética (estimativa)</div>
          <div className="text-2xl font-serif text-white">
            {massaMuscular ? fmtKg(massaMuscular.value) : '—'}
          </div>
          <div className="jsm-label text-[11px] mt-1">
            {massaMuscular ? massaMuscular.source : 'Preencha braço, coxa e panturrilha (dobra + circunferência) para estimar.'}
          </div>
          {massaMuscular && <div className="jsm-label text-[11px]">MLG ≠ massa muscular (MLG inclui osso, água e vísceras).</div>}
        </div>
      </div>

      <div className="jsm-card">
        <h2 className="text-xl mb-4">IMC e peso</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <div className="jsm-label text-sm">IMC</div>
            <div className="text-2xl font-serif">{fmtNumber(imc, 1)}</div>
            <span className="jsm-badge-yellow mt-1 inline-block">{imcClass.label}</span>
            <div className="jsm-label text-[11px] mt-1">OMS — não distingue massa magra de gorda</div>
          </div>
          <div>
            <div className="jsm-label text-sm">Faixa de peso saudável</div>
            <div className="text-lg">{fmtKg(pesoSaudavel.min)} – {fmtKg(pesoSaudavel.max)}</div>
          </div>
          <div>
            <div className="jsm-label text-sm">Peso-alvo (meta {fmtPct(metaG, 0)})</div>
            <div className="text-lg">{fmtKg(pesoAlvo)}</div>
            <div className="jsm-label text-[11px] mt-1">
              {pesoAlvo < peso ? `Perder ${fmtKg(peso - pesoAlvo)} de gordura, preservando a MLG` : 'Peso atual já dentro da meta'}
            </div>
          </div>
        </div>
      </div>

      <div className="jsm-card">
        <h2 className="text-xl mb-2">Risco cardiovascular</h2>
        {!risco.aplicavel ? (
          <p className="jsm-label text-sm">Não aplicável para esta faixa etária.</p>
        ) : (
          <div>
            <RiscoLinha label="Circunferência da cintura" dado={risco.cintura} />
            <RiscoLinha label="Relação Cintura-Quadril (RCQ)" dado={risco.rcq} />
            <RiscoLinha label="Relação Cintura-Estatura (RCEst)" dado={risco.rcest} />
          </div>
        )}
      </div>

      <div className="jsm-card">
        <h2 className="text-xl mb-4">Gasto energético</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="jsm-label text-sm">TMB — {tmb.source}</div>
            <div className="text-2xl font-serif">{fmtKcal(tmb.value)}</div>
          </div>
          <div>
            <div className="jsm-label text-sm">GET (gasto energético total)</div>
            <div className="text-2xl font-serif">{fmtKcal(get)}</div>
          </div>
        </div>
        {caloriasAjustadas && (
          <div className="mt-3 bg-black/20 rounded-lg p-3 text-sm">
            Meta calórica sugerida: {fmtKcal(caloriasAjustadas.min)} – {fmtKcal(caloriasAjustadas.max)}
          </div>
        )}
      </div>

      {macros && (
        <div className="jsm-card">
          <h2 className="text-xl mb-1">Macronutrientes (referência)</h2>
          <p className="jsm-label text-xs mb-4">Orientação educativa — prescrição individualizada é atribuição do nutricionista.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="jsm-label text-sm">Proteína</div>
              <div className="text-xl">{fmtNumber(macros.proteina.g, 0)} g/dia</div>
              <div className="jsm-label text-xs">{fmtNumber(macros.proteina.pct, 0)}% do VCT · {fmtNumber(macros.proteina.gPorKg, 1)} g/kg</div>
            </div>
            <div>
              <div className="jsm-label text-sm">Gordura</div>
              <div className="text-xl">{fmtNumber(macros.gordura.g, 0)} g/dia</div>
              <div className="jsm-label text-xs">{fmtNumber(macros.gordura.pct, 0)}% do VCT</div>
            </div>
            <div>
              <div className="jsm-label text-sm">Carboidrato</div>
              <div className="text-xl">{fmtNumber(macros.carboidrato.g, 0)} g/dia</div>
              <div className="jsm-label text-xs">{fmtNumber(macros.carboidrato.pct, 0)}% do VCT</div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button className="jsm-btn-secondary" onClick={onBack}>← Voltar</button>
        <button className="jsm-btn-primary" onClick={onNext}>Ver orientação →</button>
      </div>
    </div>
  );
}

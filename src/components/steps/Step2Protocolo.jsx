import { protocolosParaPopulacao } from '../../calculations/protocolMeta.js';

export default function Step2Protocolo({ populacao, sexo, selecionados, onChange, onBack, onNext }) {
  const disponiveis = protocolosParaPopulacao(populacao).filter(
    (p) => p.sexo === 'ambos' || p.sexo === sexo
  );

  const toggle = (id) => {
    if (selecionados.includes(id)) onChange(selecionados.filter((s) => s !== id));
    else onChange([...selecionados, id]);
  };

  return (
    <div className="space-y-6">
      <div className="jsm-card">
        <h2 className="text-xl mb-1">Protocolos disponíveis</h2>
        <p className="jsm-label text-sm mb-4">
          Selecione um protocolo, ou marque dois ou mais para comparar/combinar resultados lado a lado.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {disponiveis.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => toggle(p.id)}
              className={`rounded-xl p-4 text-left border-2 transition ${
                selecionados.includes(p.id)
                  ? 'border-jsm-teal bg-jsm-teal/10'
                  : 'border-white/10 bg-black/20 hover:border-white/30'
              }`}
            >
              <div className="font-semibold text-sm">{p.label}</div>
              <div className="jsm-label text-xs mt-1">{p.source}</div>
            </button>
          ))}
          {disponiveis.length === 0 && (
            <p className="jsm-label text-sm">Nenhum protocolo compatível com a população/sexo selecionados.</p>
          )}
        </div>
        {selecionados.length > 1 && (
          <div className="mt-4 jsm-badge-yellow inline-block">
            Modo comparação ativo — {selecionados.length} protocolos serão executados
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button className="jsm-btn-secondary" onClick={onBack}>← Voltar</button>
        <button className="jsm-btn-primary" disabled={selecionados.length === 0} onClick={onNext}>
          Avançar →
        </button>
      </div>
    </div>
  );
}

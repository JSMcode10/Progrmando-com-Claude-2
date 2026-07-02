import { POPULACOES } from '../../calculations/protocolMeta.js';
import { ACTIVITY_LABELS } from '../../calculations/constants.js';

function suggestPopulacao(idade) {
  if (idade == null || idade === '') return null;
  const n = Number(idade);
  if (n >= 7 && n <= 17) return 'crianca';
  if (n >= 18 && n <= 29) return 'jovem';
  if (n >= 30 && n <= 59) return 'adulto';
  if (n >= 60) return 'idoso';
  return null;
}

export default function Step1Identificacao({ data, onChange, populacao, onPopulacaoChange, onNext }) {
  const set = (field) => (e) => onChange({ ...data, [field]: e.target.value });

  const sugerida = suggestPopulacao(data.idade);
  const podeAvancar = data.sexo && data.idade && data.peso && data.alturaCm && populacao;

  return (
    <div className="space-y-6">
      <div className="jsm-card">
        <h2 className="text-xl mb-4">Identificação do avaliado</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="jsm-label">Nome (opcional)</label>
            <input className="jsm-input mt-1" value={data.nome || ''} onChange={set('nome')} placeholder="Nome do aluno" />
          </div>
          <div>
            <label className="jsm-label">Sexo biológico</label>
            <select className="jsm-input mt-1" value={data.sexo || ''} onChange={set('sexo')}>
              <option value="">Selecione</option>
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
            </select>
          </div>
          <div>
            <label className="jsm-label">Idade (anos)</label>
            <input type="number" className="jsm-input mt-1" value={data.idade || ''} onChange={set('idade')} min="7" max="110" />
          </div>
          <div>
            <label className="jsm-label">Peso (kg)</label>
            <input type="number" step="0.1" className="jsm-input mt-1" value={data.peso || ''} onChange={set('peso')} />
          </div>
          <div>
            <label className="jsm-label">Estatura (cm)</label>
            <input type="number" step="0.1" className="jsm-input mt-1" value={data.alturaCm || ''} onChange={set('alturaCm')} />
          </div>
          <div>
            <label className="jsm-label">Nível de atividade física</label>
            <select className="jsm-input mt-1" value={data.nivelAtividade || 'sedentario'} onChange={set('nivelAtividade')}>
              {Object.entries(ACTIVITY_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="jsm-label">Objetivo</label>
            <select className="jsm-input mt-1" value={data.objetivo || 'manter'} onChange={set('objetivo')}>
              <option value="emagrecer">Emagrecer</option>
              <option value="manter">Manter</option>
              <option value="hipertrofia">Ganhar massa</option>
            </select>
          </div>
        </div>
      </div>

      <div className="jsm-card">
        <h2 className="text-xl mb-1">Faixa / população</h2>
        {sugerida && (
          <p className="jsm-label text-xs mb-3">
            Sugestão pela idade informada: <span className="text-jsm-teal">{POPULACOES.find((p) => p.id === sugerida)?.label}</span>
          </p>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {POPULACOES.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onPopulacaoChange(p.id)}
              className={`rounded-xl p-4 text-left border-2 transition ${
                populacao === p.id
                  ? 'border-jsm-teal bg-jsm-teal/10'
                  : 'border-white/10 bg-black/20 hover:border-white/30'
              }`}
            >
              <div className="text-sm font-semibold">{p.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button className="jsm-btn-primary" disabled={!podeAvancar} onClick={onNext}>
          Avançar →
        </button>
      </div>
    </div>
  );
}

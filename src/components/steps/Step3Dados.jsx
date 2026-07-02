import { PROTOCOLOS, DOBRAS_LABELS } from '../../calculations/protocolMeta.js';

const CIRCUNFERENCIAS = [
  { key: 'cintura', label: 'Cintura' },
  { key: 'quadril', label: 'Quadril' },
  { key: 'abdome', label: 'Abdômen' },
  { key: 'pescoco', label: 'Pescoço' },
  { key: 'braco', label: 'Braço (relaxado)' },
  { key: 'coxaCirc', label: 'Coxa' },
  { key: 'panturrilhaCirc', label: 'Panturrilha' },
];

export default function Step3Dados({ protocolosSelecionados, dobras, onDobrasChange, circunferencias, onCircunferenciasChange, onBack, onNext }) {
  const camposDobras = [
    ...new Set(protocolosSelecionados.flatMap((id) => PROTOCOLOS[id]?.dobras || [])),
  ];

  const setDobra = (campo) => (e) => onDobrasChange({ ...dobras, [campo]: e.target.value });
  const setCirc = (campo) => (e) => onCircunferenciasChange({ ...circunferencias, [campo]: e.target.value });

  const dobrasCompletas = camposDobras.every((c) => dobras[c] !== undefined && dobras[c] !== '');

  return (
    <div className="space-y-6">
      {camposDobras.length > 0 && (
        <div className="jsm-card">
          <h2 className="text-xl mb-1">Dobras cutâneas (mm)</h2>
          <p className="jsm-label text-sm mb-4">
            Apenas os pontos exigidos pelo(s) protocolo(s) selecionado(s).
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {camposDobras.map((campo) => (
              <div key={campo}>
                <label className="jsm-label">{DOBRAS_LABELS[campo] || campo}</label>
                <input
                  type="number"
                  step="0.1"
                  className="jsm-input mt-1"
                  value={dobras[campo] || ''}
                  onChange={setDobra(campo)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="jsm-card">
        <h2 className="text-xl mb-1">Circunferências (cm)</h2>
        <p className="jsm-label text-sm mb-4">
          Usadas para risco cardiovascular e estimativa de massa muscular. Preencha ao menos cintura
          (e quadril, para RCQ).
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {CIRCUNFERENCIAS.map(({ key, label }) => (
            <div key={key}>
              <label className="jsm-label">{label}</label>
              <input
                type="number"
                step="0.1"
                className="jsm-input mt-1"
                value={circunferencias[key] || ''}
                onChange={setCirc(key)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button className="jsm-btn-secondary" onClick={onBack}>← Voltar</button>
        <button className="jsm-btn-primary" disabled={!dobrasCompletas} onClick={onNext}>
          Ver resultados →
        </button>
      </div>
    </div>
  );
}

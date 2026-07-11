import { useState } from 'react';

const initial = { nome: '', sexo: '', data_nascimento: '', telefone: '', objetivo: 'manter', observacoes: '' };

function isoToBr(iso) {
  const [y, m, d] = (iso || '').split('-');
  if (!y || !m || !d) return '';
  return `${d}/${m}/${y}`;
}

// Converte "dd/mm/aaaa" em "aaaa-mm-dd", validando dias por mês/ano; retorna
// '' enquanto a digitação estiver incompleta ou a data for inválida.
function brToIso(br) {
  const digits = br.replace(/\D/g, '');
  if (digits.length !== 8) return '';
  const d = digits.slice(0, 2);
  const m = digits.slice(2, 4);
  const y = digits.slice(4, 8);
  const date = new Date(`${y}-${m}-${d}T00:00:00`);
  if (Number.isNaN(date.getTime()) || date.getDate() !== Number(d) || date.getMonth() + 1 !== Number(m)) {
    return '';
  }
  return `${y}-${m}-${d}`;
}

function maskBrDate(value) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  const parts = [];
  if (digits.length > 0) parts.push(digits.slice(0, 2));
  if (digits.length > 2) parts.push(digits.slice(2, 4));
  if (digits.length > 4) parts.push(digits.slice(4, 8));
  return parts.join('/');
}

function DataNascimentoField({ valueIso, onChangeIso }) {
  const [texto, setTexto] = useState(isoToBr(valueIso));

  const handleChange = (e) => {
    const masked = maskBrDate(e.target.value);
    setTexto(masked);
    onChangeIso(brToIso(masked));
  };

  return (
    <div>
      <label className="jsm-label">Data de nascimento</label>
      <input
        type="text"
        inputMode="numeric"
        placeholder="dd/mm/aaaa"
        maxLength={10}
        className="jsm-input mt-1"
        value={texto}
        onChange={handleChange}
      />
    </div>
  );
}

export default function AlunoForm({ onSave, onCancel }) {
  const [dados, setDados] = useState(initial);
  const [salvando, setSalvando] = useState(false);

  const set = (field) => (e) => setDados({ ...dados, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    await onSave(dados);
    setSalvando(false);
  };

  return (
    <form onSubmit={handleSubmit} className="jsm-card space-y-4">
      <h2 className="text-xl">Novo aluno</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="jsm-label">Nome</label>
          <input required className="jsm-input mt-1" value={dados.nome} onChange={set('nome')} />
        </div>
        <div>
          <label className="jsm-label">Sexo biológico</label>
          <select className="jsm-input mt-1" value={dados.sexo} onChange={set('sexo')}>
            <option value="">Selecione</option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
          </select>
        </div>
        <DataNascimentoField
          valueIso={dados.data_nascimento}
          onChangeIso={(iso) => setDados((prev) => ({ ...prev, data_nascimento: iso }))}
        />
        <div>
          <label className="jsm-label">Telefone/WhatsApp</label>
          <input className="jsm-input mt-1" value={dados.telefone} onChange={set('telefone')} placeholder="55DDNÚMERO" />
        </div>
        <div>
          <label className="jsm-label">Objetivo</label>
          <select className="jsm-input mt-1" value={dados.objetivo} onChange={set('objetivo')}>
            <option value="emagrecer">Emagrecer</option>
            <option value="manter">Manter</option>
            <option value="hipertrofia">Ganhar massa</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="jsm-label">Observações</label>
          <textarea className="jsm-input mt-1" rows={2} value={dados.observacoes} onChange={set('observacoes')} />
        </div>
      </div>
      <div className="flex gap-3">
        <button type="submit" className="jsm-btn-primary" disabled={salvando}>{salvando ? 'Salvando…' : 'Salvar aluno'}</button>
        <button type="button" className="jsm-btn-secondary" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}

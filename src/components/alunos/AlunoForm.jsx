import { useState } from 'react';

const initial = { nome: '', sexo: '', data_nascimento: '', telefone: '', objetivo: 'manter', observacoes: '' };

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
        <div>
          <label className="jsm-label">Data de nascimento</label>
          <input type="date" className="jsm-input mt-1" value={dados.data_nascimento} onChange={set('data_nascimento')} />
        </div>
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

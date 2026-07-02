import { useEffect, useState } from 'react';
import { listarAlunos, criarAluno } from '../../lib/db.js';
import AlunoForm from './AlunoForm.jsx';

export default function AlunosList({ onSelecionar }) {
  const [alunos, setAlunos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [offline, setOffline] = useState(false);
  const [busca, setBusca] = useState('');

  const carregar = async () => {
    setCarregando(true);
    const { data, offline: off } = await listarAlunos();
    setAlunos(data || []);
    setOffline(off);
    setCarregando(false);
  };

  useEffect(() => {
    carregar();
  }, []);

  const handleSalvar = async (dados) => {
    await criarAluno(dados);
    setMostrarForm(false);
    carregar();
  };

  const filtrados = alunos.filter((a) => a.nome.toLowerCase().includes(busca.toLowerCase()));

  return (
    <div className="space-y-6">
      {offline && (
        <div className="bg-jsm-gold/10 border border-jsm-gold/30 rounded-xl px-4 py-3 text-xs text-jsm-gold/90">
          Modo offline: dados salvos apenas neste dispositivo (localStorage).
        </div>
      )}

      {mostrarForm ? (
        <AlunoForm onSave={handleSalvar} onCancel={() => setMostrarForm(false)} />
      ) : (
        <div className="jsm-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl">Meus alunos</h2>
            <button className="jsm-btn-primary" onClick={() => setMostrarForm(true)}>+ Novo aluno</button>
          </div>
          <input
            className="jsm-input mb-4"
            placeholder="Buscar por nome…"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          {carregando && <p className="jsm-label text-sm">Carregando…</p>}
          {!carregando && filtrados.length === 0 && <p className="jsm-label text-sm">Nenhum aluno cadastrado ainda.</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtrados.map((aluno) => (
              <button
                key={aluno.id}
                onClick={() => onSelecionar(aluno)}
                className="text-left bg-black/20 hover:border-jsm-teal border border-white/10 rounded-xl p-4 transition"
              >
                <div className="font-semibold">{aluno.nome}</div>
                <div className="jsm-label text-xs mt-1">
                  {aluno.sexo || '—'} · {aluno.objetivo || '—'}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

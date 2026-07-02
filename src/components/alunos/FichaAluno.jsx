import { useEffect, useState } from 'react';
import { listarAvaliacoes, listarUltimas6, excluirAvaliacao } from '../../lib/db.js';
import EvolutionCharts from '../evolucao/EvolutionCharts.jsx';
import CompareView from '../evolucao/CompareView.jsx';
import { fmtPct, fmtKg } from '../../utils/format.js';
import { calcularIdade } from '../../utils/idade.js';

export default function FichaAluno({ aluno, onVoltar, onNovaAvaliacao }) {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [ultimas6, setUltimas6] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mostrarComparar, setMostrarComparar] = useState(false);
  const [mostrarHistoricoCompleto, setMostrarHistoricoCompleto] = useState(false);

  const carregar = async () => {
    setCarregando(true);
    const [todas, seis] = await Promise.all([listarAvaliacoes(aluno.id), listarUltimas6(aluno.id)]);
    setAvaliacoes(todas.data || []);
    setUltimas6(seis.data || []);
    setCarregando(false);
  };

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aluno.id]);

  const handleExcluir = async (id) => {
    await excluirAvaliacao(id);
    carregar();
  };

  const idade = calcularIdade(aluno.data_nascimento);

  return (
    <div className="space-y-6">
      <div className="jsm-card">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-serif">{aluno.nome}</h2>
            <p className="jsm-label text-sm mt-1">
              {aluno.sexo || '—'} {idade != null && `· ${idade} anos`} · Objetivo: {aluno.objetivo || '—'}
            </p>
            {aluno.telefone && <p className="jsm-label text-sm">{aluno.telefone}</p>}
            {aluno.observacoes && <p className="text-sm mt-2">{aluno.observacoes}</p>}
          </div>
          <button className="jsm-btn-secondary" onClick={onVoltar}>← Alunos</button>
        </div>
        <div className="flex gap-3 mt-4">
          <button className="jsm-btn-primary" onClick={() => onNovaAvaliacao(aluno)}>+ Nova avaliação</button>
          {avaliacoes.length >= 2 && (
            <button className="jsm-btn-secondary" onClick={() => setMostrarComparar((v) => !v)}>
              {mostrarComparar ? 'Fechar comparação' : 'Comparar avaliações'}
            </button>
          )}
        </div>
      </div>

      {mostrarComparar && (
        <CompareView avaliacoes={avaliacoes} objetivo={aluno.objetivo} onClose={() => setMostrarComparar(false)} />
      )}

      <div className="jsm-card">
        <h3 className="text-xl mb-1">Evolução</h3>
        {avaliacoes.length > 6 && (
          <p className="jsm-label text-xs mb-3">
            Mostrando as 6 avaliações mais recentes de {avaliacoes.length} registradas.{' '}
            <button className="underline text-jsm-teal" onClick={() => setMostrarHistoricoCompleto((v) => !v)}>
              {mostrarHistoricoCompleto ? 'ocultar histórico completo' : 'ver histórico completo'}
            </button>
          </p>
        )}
        {!carregando && <EvolutionCharts avaliacoesAsc={ultimas6} objetivo={aluno.objetivo} />}
      </div>

      <div className="jsm-card">
        <h3 className="text-xl mb-4">{mostrarHistoricoCompleto ? 'Histórico completo' : 'Avaliações recentes'}</h3>
        {avaliacoes.length === 0 && <p className="jsm-label text-sm">Nenhuma avaliação registrada ainda.</p>}
        <div className="space-y-2">
          {(mostrarHistoricoCompleto ? avaliacoes : avaliacoes.slice(0, 6)).map((a) => {
            const comp = a.resultado_completo?.composicao;
            return (
              <div key={a.id} className="flex items-center justify-between bg-black/20 rounded-lg p-3">
                <div>
                  <div className="font-semibold text-sm">{new Date(a.data_avaliacao).toLocaleDateString('pt-BR')}</div>
                  <div className="jsm-label text-xs">
                    {comp && `%G ${fmtPct(comp.pctGMedio)} · Peso ${fmtKg(comp.peso)}`}
                  </div>
                </div>
                <button className="jsm-btn-secondary text-xs" onClick={() => handleExcluir(a.id)}>Remover</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

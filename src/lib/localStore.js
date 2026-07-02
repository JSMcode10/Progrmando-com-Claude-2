// Fallback local (localStorage) usado quando o Supabase não está configurado
// ou uma chamada falha por perda de conectividade. Mantém a mesma forma de
// dados das tabelas do Supabase para que o restante do app não precise saber
// qual fonte está sendo usada.

const ALUNOS_KEY = 'jsm-offline:alunos';
const AVALIACOES_KEY = 'jsm-offline:avaliacoes';

function readAll(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(key, list) {
  localStorage.setItem(key, JSON.stringify(list));
}

export const localAlunos = {
  list() {
    return readAll(ALUNOS_KEY).sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  },
  create(dados) {
    const aluno = {
      id: crypto.randomUUID(),
      profissional_id: 'offline',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...dados,
      _pendingSync: true,
    };
    const all = readAll(ALUNOS_KEY);
    all.push(aluno);
    writeAll(ALUNOS_KEY, all);
    return aluno;
  },
  update(id, dados) {
    const all = readAll(ALUNOS_KEY);
    const idx = all.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error('Aluno não encontrado (offline).');
    all[idx] = { ...all[idx], ...dados, updated_at: new Date().toISOString(), _pendingSync: true };
    writeAll(ALUNOS_KEY, all);
    return all[idx];
  },
  remove(id) {
    writeAll(ALUNOS_KEY, readAll(ALUNOS_KEY).filter((a) => a.id !== id));
    writeAll(AVALIACOES_KEY, readAll(AVALIACOES_KEY).filter((a) => a.aluno_id !== id));
  },
};

export const localAvaliacoes = {
  listByAluno(alunoId) {
    return readAll(AVALIACOES_KEY)
      .filter((a) => a.aluno_id === alunoId)
      .sort((a, b) => new Date(b.data_avaliacao) - new Date(a.data_avaliacao));
  },
  create(alunoId, payload) {
    const avaliacao = {
      id: crypto.randomUUID(),
      aluno_id: alunoId,
      profissional_id: 'offline',
      created_at: new Date().toISOString(),
      data_avaliacao: new Date().toISOString().slice(0, 10),
      ...payload,
      _pendingSync: true,
    };
    const all = readAll(AVALIACOES_KEY);
    all.push(avaliacao);
    writeAll(AVALIACOES_KEY, all);
    return avaliacao;
  },
  remove(id) {
    writeAll(AVALIACOES_KEY, readAll(AVALIACOES_KEY).filter((a) => a.id !== id));
  },
  pendentes() {
    return readAll(AVALIACOES_KEY).filter((a) => a._pendingSync);
  },
};

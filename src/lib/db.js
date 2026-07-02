// Camada de dados: Supabase como fonte primária, com fallback automático para
// localStorage (modo offline) quando o Supabase não está configurado ou uma
// chamada falha (ex.: sem conexão). Todas as funções são assíncronas e
// retornam { data, error, offline }.

import { supabase, supabaseConfigured } from './supabase.js';
import { localAlunos, localAvaliacoes } from './localStore.js';

async function currentUserId() {
  const { data } = await supabase.auth.getUser();
  return data?.user?.id;
}

function ok(data, offline = false) {
  return { data, error: null, offline };
}

function fail(error, offline = false) {
  return { data: null, error: error?.message || String(error), offline };
}

// --- Alunos ------------------------------------------------------------

export async function listarAlunos() {
  if (!supabaseConfigured) return ok(localAlunos.list(), true);
  try {
    const { data, error } = await supabase.from('alunos').select('*').order('nome');
    if (error) throw error;
    return ok(data);
  } catch (e) {
    return ok(localAlunos.list(), true);
  }
}

export async function criarAluno(dados) {
  if (!supabaseConfigured) return ok(localAlunos.create(dados), true);
  try {
    const profissional_id = await currentUserId();
    const { data, error } = await supabase
      .from('alunos')
      .insert([{ ...dados, profissional_id }])
      .select()
      .single();
    if (error) throw error;
    return ok(data);
  } catch (e) {
    return ok(localAlunos.create(dados), true);
  }
}

export async function atualizarAluno(id, dados) {
  if (!supabaseConfigured) return ok(localAlunos.update(id, dados), true);
  try {
    const { data, error } = await supabase.from('alunos').update(dados).eq('id', id).select().single();
    if (error) throw error;
    return ok(data);
  } catch (e) {
    return fail(e);
  }
}

export async function excluirAluno(id) {
  if (!supabaseConfigured) {
    localAlunos.remove(id);
    return ok(true, true);
  }
  try {
    const { error } = await supabase.from('alunos').delete().eq('id', id);
    if (error) throw error;
    return ok(true);
  } catch (e) {
    return fail(e);
  }
}

// --- Avaliações ----------------------------------------------------------

export async function listarAvaliacoes(alunoId) {
  if (!supabaseConfigured) return ok(localAvaliacoes.listByAluno(alunoId), true);
  try {
    const { data, error } = await supabase
      .from('avaliacoes')
      .select('*')
      .eq('aluno_id', alunoId)
      .order('data_avaliacao', { ascending: false });
    if (error) throw error;
    return ok(data);
  } catch (e) {
    return ok(localAvaliacoes.listByAluno(alunoId), true);
  }
}

export async function listarUltimas6(alunoId) {
  const { data, error, offline } = await listarAvaliacoes(alunoId);
  if (error) return fail(error, offline);
  const ultimas6 = [...data].slice(0, 6).reverse(); // já vem desc; pega as 6 mais recentes e ordena asc
  return ok(ultimas6, offline);
}

export async function salvarAvaliacao(alunoId, payload) {
  if (!supabaseConfigured) return ok(localAvaliacoes.create(alunoId, payload), true);
  try {
    const profissional_id = await currentUserId();
    const { data, error } = await supabase
      .from('avaliacoes')
      .insert([{ ...payload, aluno_id: alunoId, profissional_id }])
      .select()
      .single();
    if (error) throw error;
    return ok(data);
  } catch (e) {
    return ok(localAvaliacoes.create(alunoId, payload), true);
  }
}

export async function excluirAvaliacao(id) {
  if (!supabaseConfigured) {
    localAvaliacoes.remove(id);
    return ok(true, true);
  }
  try {
    const { error } = await supabase.from('avaliacoes').delete().eq('id', id);
    if (error) throw error;
    return ok(true);
  } catch (e) {
    return fail(e);
  }
}

// --- Sincronização best-effort dos registros criados offline -------------

export async function sincronizarPendentes() {
  if (!supabaseConfigured) return { sincronizados: 0 };
  const pendentes = localAvaliacoes.pendentes();
  let sincronizados = 0;
  for (const avaliacao of pendentes) {
    try {
      const profissional_id = await currentUserId();
      const { _pendingSync, id, aluno_id, ...resto } = avaliacao;
      const { error } = await supabase.from('avaliacoes').insert([{ ...resto, aluno_id, profissional_id }]);
      if (!error) {
        localAvaliacoes.remove(id);
        sincronizados += 1;
      }
    } catch {
      // segue tentando os próximos; mantém pendente
    }
  }
  return { sincronizados };
}

-- JSM Avaliação Pro — schema Supabase (Parte 2)
-- Rode este arquivo no SQL Editor do Supabase (projeto do app) ANTES de configurar
-- as variáveis de ambiente VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY.
--
-- Tabelas: alunos, avaliacoes. RLS por profissional_id = auth.uid() em ambas.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- alunos
-- ---------------------------------------------------------------------------
create table if not exists public.alunos (
  id uuid primary key default gen_random_uuid(),
  profissional_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  nome text not null,
  sexo text check (sexo in ('masculino', 'feminino')),
  data_nascimento date,
  telefone text,
  objetivo text,
  observacoes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists alunos_profissional_id_idx on public.alunos (profissional_id);

alter table public.alunos enable row level security;

create policy "alunos_select_own" on public.alunos
  for select using (profissional_id = auth.uid());
create policy "alunos_insert_own" on public.alunos
  for insert with check (profissional_id = auth.uid());
create policy "alunos_update_own" on public.alunos
  for update using (profissional_id = auth.uid()) with check (profissional_id = auth.uid());
create policy "alunos_delete_own" on public.alunos
  for delete using (profissional_id = auth.uid());

-- ---------------------------------------------------------------------------
-- avaliacoes
-- ---------------------------------------------------------------------------
create table if not exists public.avaliacoes (
  id uuid primary key default gen_random_uuid(),
  aluno_id uuid not null references public.alunos(id) on delete cascade,
  profissional_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  data_avaliacao date not null default current_date,
  populacao text,
  protocolos jsonb,
  entradas jsonb,
  resultado_completo jsonb,
  created_at timestamptz not null default now()
);

create index if not exists avaliacoes_aluno_id_idx on public.avaliacoes (aluno_id);
create index if not exists avaliacoes_profissional_id_idx on public.avaliacoes (profissional_id);
create index if not exists avaliacoes_data_idx on public.avaliacoes (aluno_id, data_avaliacao desc);

alter table public.avaliacoes enable row level security;

create policy "avaliacoes_select_own" on public.avaliacoes
  for select using (profissional_id = auth.uid());
create policy "avaliacoes_insert_own" on public.avaliacoes
  for insert with check (profissional_id = auth.uid());
create policy "avaliacoes_update_own" on public.avaliacoes
  for update using (profissional_id = auth.uid()) with check (profissional_id = auth.uid());
create policy "avaliacoes_delete_own" on public.avaliacoes
  for delete using (profissional_id = auth.uid());

-- ---------------------------------------------------------------------------
-- updated_at automático em alunos
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists alunos_set_updated_at on public.alunos;
create trigger alunos_set_updated_at
  before update on public.alunos
  for each row execute function public.set_updated_at();

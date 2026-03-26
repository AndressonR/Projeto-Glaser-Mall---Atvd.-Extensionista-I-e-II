-- Glaser Mall - Supabase (Postgres) schema + seed
-- Execute no Supabase: SQL Editor > New query > Run

-- Necessário para gen_random_uuid()
create extension if not exists pgcrypto;

-- Tabela de lojas
create table if not exists public.lojas (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nome text not null,
  numero text not null,
  telefone text not null,
  rede_social text not null,
  horario_funcionamento text not null,
  logo_url text
);

-- Ativa RLS
alter table public.lojas enable row level security;

-- Políticas:
-- 1) Qualquer pessoa pode LER (site público)
drop policy if exists "Public read lojas" on public.lojas;
create policy "Public read lojas"
on public.lojas
for select
to anon, authenticated
using (true);

-- 2) Apenas usuários autenticados podem INSERIR/ALTERAR/EXCLUIR (Admin)
drop policy if exists "Admin write lojas" on public.lojas;
create policy "Admin write lojas"
on public.lojas
for all
to authenticated
using (true)
with check (true);

-- Seed (só insere se a tabela estiver vazia)
insert into public.lojas (nome, numero, telefone, rede_social, horario_funcionamento)
select * from (values
  ('Lavanderia Lemes','Loja 01 A','(41) 99578-4429','@lavanderoalemes','Seg - Sex 9h às 19h e Sábado 9h às 18h'),
  ('Casa do Nordeste Mandacaru','Loja 02 A','(41) 99607-6972','@casadonordestemandacaru','Seg - Sáb 8h às 20h'),
  ('Marka da Paz','Loja 03 A','(41) 99662-0878','@mkp.curitiba','Seg - Sex 9h às 19h e Sábado 9h às 16h'),
  ('Best Workout','Loja 04 A','(41) 98751-5374','@studiobestworkout','Seg - Sex 6:30 às 11h / 14h às 22h e Sábado 7:30 às 10h'),
  ('Mappi Odonto','Lojas 05 A e 06 A','(41) 0000-0000','@mappiodonto','Seg - Sex 9h às 19h e Sábado 8h às 18h'),
  ('Pet House','Loja 01 B','(41) 3095-0554','@pethouse.cwb','Seg - Sex 9h às 19h e Sábado 9h às 18h'),
  ('Pancini Celulares','Loja 02 B','(41) 98817-7082','@pancini.celulares','Seg - Sex 9h às 18h e Sábado 9h às 17h'),
  ('Barbearia K2','Loja 03 B','(41) 99972-0844','@k2.barbearia','Seg - Sáb 9h às 19h')
) as v(nome, numero, telefone, rede_social, horario_funcionamento)
where not exists (select 1 from public.lojas);

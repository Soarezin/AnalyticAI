-- AnalyticsAI schema (MVP v2)
-- TODO: habilitar RLS e políticas por owner_key.

create table if not exists plans (
  id text primary key,
  daily_limit int not null
);

insert into plans (id, daily_limit) values
  ('FREE', 10) on conflict do nothing,
  ('PRO', 30) on conflict do nothing,
  ('ULTRA', 100) on conflict do nothing;

create table if not exists api_keys (
  api_key text primary key,
  plan text not null references plans (id),
  usage_today int not null default 0,
  reset_at timestamptz not null default (now()::date + interval '1 day')
);

create table if not exists collections (
  id uuid primary key default gen_random_uuid(),
  owner_key text not null references api_keys (api_key),
  name text not null,
  color text,
  created_at timestamptz not null default now()
);

create table if not exists tags (
  id uuid primary key default gen_random_uuid(),
  owner_key text not null references api_keys (api_key),
  name text not null,
  color text,
  created_at timestamptz not null default now(),
  unique (owner_key, name)
);

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  owner_key text not null references api_keys (api_key),
  collection_id uuid references collections (id) on delete set null,
  filename text not null,
  mime_type text,
  pages int,
  size_bytes bigint,
  status text default 'processed',
  storage_path text,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists document_tags (
  document_id uuid not null references documents (id) on delete cascade,
  tag_id uuid not null references tags (id) on delete cascade,
  primary key (document_id, tag_id)
);

create table if not exists analyses (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references documents (id) on delete cascade,
  summary text,
  issues jsonb,
  deadlines jsonb,
  created_at timestamptz not null default now()
);

create table if not exists usage_logs (
  id uuid primary key default gen_random_uuid(),
  api_key text not null references api_keys (api_key),
  endpoint text not null,
  status int not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_documents_owner_created on documents (owner_key, created_at desc);
create index if not exists idx_documents_collection on documents (collection_id);
create index if not exists idx_analyses_doc on analyses (document_id);

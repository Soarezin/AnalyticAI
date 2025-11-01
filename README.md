# AnalyticsAI

Painel web e API para análise de contratos com upload, biblioteca, visualização PDF e insights automáticos.

## Estrutura

- `app/`: Frontend em React (Vite) com Tailwind e shadcn-like components.
- `api/`: Backend Node/Express integrado ao Supabase (Postgres + Storage).

## Requisitos

- Node.js 18+
- Conta Supabase com tabelas conforme `docs/schema.sql` (TODO)

## Configuração rápida

1. Instale dependências:

```bash
cd api && npm install
cd ../app && npm install
```

2. Configure variáveis de ambiente copiando `api/.env.example` para `.env` e preenchendo credenciais Supabase.
3. Em `app/.env`, defina `VITE_API_BASE` apontando para o backend (ex: `http://localhost:5175/api`).
4. Rode o backend:

```bash
cd api
npm run dev
```

5. Rode o frontend:

```bash
cd app
npm run dev
```

## TODOs

- Autenticação real por workspace (Supabase Auth + RLS).
- Pipelines de NLP/LLM com coordenadas precisas.
- Paginação avançada, criação inline de tags/coleções e upload direto ao Storage.
- Rate limit persistente com reset automático.
- Integração Google Calendar real.

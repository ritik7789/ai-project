# Frontend (Angular)

Angular frontend integrated with FastAPI backend.

## Prerequisites

- Node `v24.14.0` (see `.nvmrc`)
- npm `11+`
- Backend running at `http://127.0.0.1:8000`

## Install

```bash
cd frontend
npm install
```

## Run in development

```bash
npm run start
```

The app runs at `http://localhost:4200`.
API calls use `/api/*` and are proxied to `http://127.0.0.1:8000` via `proxy.conf.json`.

## API URL configuration

- `src/environments/environment.ts` uses `apiBaseUrl: '/api'` for local proxy-based development.
- `src/environments/environment.prod.ts` uses direct backend URL `http://127.0.0.1:8000`.

If you deploy elsewhere, update `environment.prod.ts` to your backend host.

## Available scripts

- `npm run start` - dev server with API proxy
- `npm run build` - production build
- `npm run test` - unit tests
- `npm run lint` - ESLint checks

## Feature routes

- `/users` - list/create/update/delete users
- `/erp-documents` - list/create/delete ERP documents
- `/rag` - query RAG endpoint

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Vite dev server
npm run build     # tsc (type-check, noEmit) + vite build
npm run lint      # eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0
npm run preview   # preview a production build
```

There is no test runner configured in this repo. There is no ESLint config file at the repo root despite the `lint` script — running it will fail until one is added.

## Environment

Runtime config comes from `VITE_API_URL` (see `.env.example`), read via `src/config/env.ts` (`ENV.API_URL`). It defaults to `https://api.ovniwallet.com` if unset. `httpClient` (`src/api/httpClient.ts`) uses `ENV.API_URL` as its axios `baseURL` directly — the backend's `/api/v1` prefix is expected to already be part of that URL, so API modules call relative paths like `/wallets/balance`, `/auth/login`, `/p2p/transfers`.

## Architecture

**Feature-based structure.** Each domain lives under `src/features/<name>/` with its own `pages/`, `components/`, `hooks/`, `types.ts`, and sometimes `services/` or `mocks/`. Current features: `auth`, `dashboard`, `wallets`, `transactions`, `exchange`, `p2p`, `virtual-cards`, `chatbot`.

**API layer is split in two, and features are not consistent about which they call:**
- `src/api/*.api.ts` — one module per resource (`auth.api.ts`, `wallets.api.ts`, `transactions.api.ts`, `p2p.api.ts`, `exchange.api.ts`, `chatbot.api.ts`, `virtualCards.api.ts`), each wrapping `httpClient` calls to specific backend endpoints and unwrapping the `{ status, data }` response envelope.
- Some features additionally have a `src/features/<name>/services/*.service.ts` layer (e.g. `auth.service.ts`) that just re-exports the corresponding `*.api.ts` calls — a thin indirection some hooks/components call instead of the api module directly. Not every feature has one; check before assuming it exists.

Backend responses are consistently shaped `{ status: 'success', data: {...} }`; api modules unwrap `response.data.data` (or `response.data`) before returning to callers. `src/api/errors.ts` (`getApiError`) normalizes axios error responses into `{ code, message }` for consistent error handling — prefer it over reading `err.response.data` directly in new code.

**Auth** is handled via `AuthContext`/`AuthProvider` (`src/contexts/AuthContext.ts`, `src/providers/AuthProvider.tsx`), consumed through the `useAuth` hook (`src/features/auth/hooks/useAuth.ts`). Tokens (`access_token`, `refresh_token`) are stored directly in `localStorage` (not via `src/hooks/useLocalStorage.ts`) and `isAuthenticated` is derived by checking for the presence of `access_token`. `httpClient` attaches the bearer token to every request via an axios request interceptor.

**Routing** (`src/routes/AppRouter.tsx`) gates routes with `GuestRoute` (redirects authenticated users away from `/login`/`/register`) and `ProtectedRoute` (redirects unauthenticated users to `/login`), both driven by `useAuth().isAuthenticated`. Authenticated app routes render inside `AppLayout`.

**`QueryProvider`** (`src/providers/QueryProvider.tsx`) is currently a no-op passthrough despite `@tanstack/react-query` being a dependency — data fetching in most features is done with plain `useState`/`useEffect` hooks (e.g. `useWalletBalance`, `useTransactions`) rather than `useQuery`.

**Money is handled in integer cents.** `src/lib/money.ts` provides `formatMoney(amountInCents, currency)` (via `Intl.NumberFormat`) and `parseToCents(amount)`. Amounts crossing the API boundary (e.g. P2P transfer `amount_in_cents`) are cents, not decimal currency units.

**Idempotency keys** for mutating requests (e.g. P2P transfers) are generated with `generateIdempotencyKey()` (`src/lib/idempotency.ts`, `crypto.randomUUID()`) and sent as `idempotency_key` in the request body when the caller doesn't supply one.

**Path alias:** `@/*` maps to `src/*` (configured in both `tsconfig.json` and `vite.config.ts`).

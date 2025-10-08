<!-- Short, focused guidance for AI coding agents working on this repo -->
# Copilot instructions — CrazyOctagon (concise)

This file gives focused, actionable context an AI coding agent needs to be immediately productive in this repository.

1. Project overview
   - Next.js app (Next 15) with TypeScript. Entry points live under `app/` (server + client components). Root layout: `app/layout.tsx` and `app/ClientLayout.tsx`.
   - Deployed to Netlify (see `netlify.toml` and `.github/workflows/*`). Production build uses `npm run build` and publishes `out` or `./.next` depending on workflow.
   - Web3 integration: Wagmi, Viem, Alchemy, and Hardhat scripts live in `scripts/` + `contracts/`. Hardhat tasks: `scripts/upgrade_core.js`, `scripts/*.js`.

2. Build & dev commands (precise)
   - Install: `npm ci` (CI), `pnpm install` used in some workflows — prefer `npm ci` locally to match repo lockfile.
   - Dev: `npm run dev` → runs `next dev`.
   - Build (production): `npm run build` (this runs `next build` and postbuild security checks).
   - Netlify prep: `npm run clean:deploy` calls `scripts/prepare-netlify-build.mjs` before deploy.
   - Typecheck: `npm run typecheck` (tsc --noEmit). Lint: `npm run lint`.

3. Important project conventions
   - Alias `@/*` maps to repo root (see `tsconfig.json`). Use `@/components/...` in imports.
   - Codebase mixes server and client components under `app/`. Files named `*.client.tsx` are client-only (see `app/page.client.tsx`).
   - Many scripts and build-time tools live in `scripts/` and are excluded from TS checks (see `tsconfig.json` exclude list).
   - Security-first: CSP and headers are enforced in `middleware.ts` and `netlify.toml`. When modifying runtime headers, update both places.
   - Console removal configured in `next.config.mjs` (compiler.removeConsole) — don't rely on console logs in production.

4. API and middleware patterns
   - API routes under `app/api/*` and server logic there. Middleware (`middleware.ts`) implements in-memory rate limiting and sets strict security headers — keep changes minimal and preserve CSP structure.
   - Transaction-specific limits: middleware recognizes paths with `burn` and `approve` and applies stricter quotas.

5. Web3 & contracts
   - Hardhat and contract upgrade scripts are in `scripts/` and `contracts/`. Follow storage-layout rules for UUPS upgrades (see `README.md`).
   - Use environment variables defined in `netlify.toml` for chain IDs and RPCs (e.g., NEXT_PUBLIC_CHAIN_ID). Do not commit secrets.

6. Tests & CI
   - There are no unit tests configured; CI focuses on typecheck, lint, and security audit (see `package.json` scripts: `ci:check`, `ci:build`).
   - Security scripts: `security:check`, `security:critical` exist — reference them when making security-sensitive changes.

7. Where to look for examples
   - UI components: `components/` (e.g., `ConnectWalletPrompt.tsx`, `ClaimRewardsForm.tsx`). Use these for UI patterns and tailwind usage.
   - Server API patterns: `app/api/*` folders (auth, breed, burn, rewards). Inspect `app/api/burn/*` for transaction flows.
   - Deployment pipeline: `.github/workflows/netlify-deploy.yml` and `.github/workflows/deploy-netlify.yml`.

8. Safety and minimal-change rules for agents
   - Preserve security headers and CSP semantics. If you change CSP in `middleware.ts`, mirror compatible changes to `netlify.toml`.
   - Avoid changing storage layouts in contracts. Follow the UUPS checklist in `README.md` for upgrades.
   - Keep builds reproducible: prefer `npm ci` and do not modify `package.json` versions without tests/QA.

9. Quick examples
   - Quick import alias: `import Button from '@/components/Button'`
   - Client-only component: create `MyWidget.client.tsx` and use `useEffect`, `useState` as usual.

If anything here is unclear or you'd like more detail on a specific area (contracts, deploy, API routes), tell me which part and I'll expand or refine this file.

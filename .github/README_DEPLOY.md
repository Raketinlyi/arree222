Deployment mirror instructions
=============================

This repository includes a GitHub Action that mirrors either a static export (`out/`) or a minimal source subset to a target repository (default: `Raketinlyi/12`) when you push to `main`.

What you must configure in the source repository (this repo):

- Secrets:
  - `TARGET_REPO_PAT` — a Personal Access Token with `repo` scope used to push to the target repo.
  - (optional) `TARGET_REPO` — override target repo (default `Raketinlyi/12`).
  - (optional) `TARGET_BRANCH` — branch in target repo (default `main`).

- How it works:
  - On push to `main`, workflow runs `npm ci` and `npm run build`.
  - If `out/` exists (static export), the workflow copies `out/` contents to the target repo and pushes.
  - Otherwise the workflow copies a minimal set of files required for Vercel/Next.js deploy: `app/`, `public/`, `next.config.mjs`, `package.json`, and optional files like `.vercel`/`vercel.json`.

Security notes:
- Use a machine/service account token with limited permissions and rotate it periodically.
- Do not store secrets in code or logs.

Vercel setup:
- Connect the target GitHub repo (`Raketinlyi/12`) to Vercel and configure the domain at your Vercel project settings.
- Ensure Vercel build settings match this project's Node version and `npm run build` command.

If you want, I can create a PR with these changes to the source repo and help configure the target repo secrets.

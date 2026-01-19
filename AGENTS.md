# Repository Guidelines

## Project Structure & Module Organization
- `app/` holds Next.js App Router routes, layouts, and API handlers (see `app/api/*`).
- `components/` contains shared UI; `components/ui` for shadcn-style primitives and `components/views` for page-level views.
- `contexts/` stores React context providers and hooks for shared state.
- `lib/` houses utilities, API helpers, and shared logic.
- `types/` defines shared TypeScript types and interfaces.
- `public/` contains static assets served at `/`.
- `middleware.ts` and `next.config.ts` control runtime and build behavior.

## Build, Test, and Development Commands
- `npm install` install dependencies.
- `npm run dev` start the local dev server with Turbopack at `http://localhost:3000`.
- `npm run build` create a production build.
- `npm run start` serve the production build.
- `npm run lint` run ESLint with Next.js core web vitals and TypeScript rules.

## Coding Style & Naming Conventions
- TypeScript-first with React 19 and the Next.js App Router; use `*.tsx` for components.
- Indentation is 2 spaces in TS/JS/JSON files.
- Naming: `PascalCase` for components and component files (e.g., `UserCard.tsx`), `camelCase` for functions/variables, and `kebab-case` for route segments.
- Use the `@/` path alias from the repo root (`@/components/...`).
- Styling uses Tailwind v4 with `app/globals.css`; avoid inline styles unless necessary.

## Testing Guidelines
- No automated test runner or `test` script is configured yet.
- If you add tests, also add a script in `package.json`, document the framework, and follow a clear naming pattern such as `*.test.ts(x)`.

## Commit & Pull Request Guidelines
- Git history favors Conventional Commit-style subjects (`feat: ...`, `fix: ...`); keep summaries short and imperative.
- Avoid empty or vague subjects (there are a few `feat:` stubs in history - do not repeat).
- PRs should include a concise description, linked issues (if any), and how changes were tested; include screenshots for UI changes.

## Security & Configuration Tips
- Store local secrets in `.env.local` (Next.js) and keep them out of version control.
- `docker-compose.yml` expects an `.env` file and exposes the app on `localhost:3001`.

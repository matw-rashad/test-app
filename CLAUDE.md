# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start dev server with Turbopack (http://localhost:3000)

# Build
npm run build        # Build for production with Turbopack

# Production
npm start            # Start production server

# Linting
npm run lint         # Run ESLint
```

## Architecture

This is a Next.js 16 admin panel application using the App Router with React Server Components.

### Key Technologies
- **Next.js 16** with Turbopack and App Router
- **Tailwind CSS v4** for styling
- **shadcn/ui** (new-york style) for UI components with Radix UI primitives
- **react-hook-form** + **zod** for form handling and validation
- **Tiptap** for rich text editing
- **sonner** for toast notifications

### Project Structure

```
app/
├── api/              # API route handlers (proxy to external backend)
│   ├── auth/         # Auth endpoints (login, logout, me, register, profile)
│   ├── configuration/
│   ├── dhlmail/
│   ├── mailsettings/
│   └── users/
├── admin/            # Protected admin pages
│   ├── layout.tsx    # Admin sidebar layout with navigation
│   └── [sections]/   # analytics, configuration, middleware-services, products, profile, settings, users
├── login/
├── register/
└── layout.tsx        # Root layout with AuthProvider

components/
├── ui/               # shadcn/ui components
└── views/            # Page-specific view components

contexts/
└── auth-context.tsx  # Client-side auth state management

types/
└── auth.ts           # TypeScript interfaces for auth
```

### Authentication Flow

1. **Middleware** (`middleware.ts`) protects `/admin/*` routes and redirects unauthenticated users
2. **API routes** proxy auth requests to external backend (`AUTH_API_URL`) and store JWT in HTTP-only cookie
3. **AuthContext** provides client-side auth state via `useAuth()` hook
4. Cookie name configured via `JWT_COOKIE_NAME` env var (default: `auth_token`)

### Path Aliases

Configured in `tsconfig.json`:
- `@/*` maps to `./*` (project root)

### shadcn/ui Configuration

Components installed via `shadcn` CLI. Config in `components.json`:
- Style: new-york
- Icons: lucide-react
- CSS variables enabled
- Base color: neutral

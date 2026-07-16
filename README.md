# React + TypeScript + Vite + Supabase

This is a template for projects using Supabase.

## Includes

- Supabase client + email/password auth (signup, login, logout, password reset)
- Protected & guest-only routes with post-login redirect
- Session context provider
- Tailwind CSS
- TanStack React Query (+ Devtools and ESLint plugin)
- React Hook Form + Zod validation
- React Router
- React Hot Toast
- Lucide React icons
- `cn()` utility (clsx + tailwind-merge)
- Prettier (+ eslint-config-prettier)
- `@/` path alias for `src/`

## Getting started

1. Clone the repo and install dependencies:

    ```sh
    npm install
    ```

2. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard) (skip if you have one).

3. Copy `.env.example` to `.env` and fill in your project's URL and publishable key (Dashboard → Settings → API Keys):

    ```sh
    cp .env.example .env
    ```

4. Link the Supabase CLI to your project and apply the migrations (creates the demo `test` table, including its RLS policy):

    ```sh
    npx supabase login
    npx supabase link --project-ref <your-project-ref>
    npx supabase db push
    ```

5. Allow the password-reset redirect URL (Dashboard → Authentication → URL Configuration → Redirect URLs). Without it, reset emails silently redirect to the Site URL instead of the update-password page:

    ```
    http://localhost:5173/update-password
    ```

    Add your production equivalent (e.g. `https://yourapp.com/update-password`) when you deploy.

6. Start the dev server:

    ```sh
    npm run dev
    ```

## Scripts

| Command                | Description                                                      |
| ---------------------- | ---------------------------------------------------------------- |
| `npm run dev`          | Start the Vite dev server                                        |
| `npm run build`        | Type-check and build for production                              |
| `npm run preview`      | Preview the production build                                     |
| `npm run lint`         | Run ESLint                                                       |
| `npm run format`       | Format the project with Prettier                                 |
| `npm run format:check` | Check formatting without writing changes                         |
| `npm run typecheck`    | Run the TypeScript compiler                                      |
| `npm run gen:types`    | Regenerate `src/types/database.types.ts` from the linked project |

## Notes

- Auth pages live in `src/pages/auth/`, route guards in `src/components/`.
- API calls go in `src/utils/supabase.ts`; wrap them in React Query hooks (`src/hooks/`).
- Zod schemas live in `src/schemas/` and plug into forms via `@hookform/resolvers`.
- Database changes go in `supabase/migrations/`; apply them with `npx supabase db push`, then run `npm run gen:types` to update the generated types.
- Remember RLS: a table with row level security enabled but no SELECT policy returns zero rows without an error.

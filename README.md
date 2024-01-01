# Sveltekit + Supabase Auth Starter

This is a starter template for [SvelteKit](https://kit.svelte.dev) apps with
[Supabase](https://supabase.io) authentication. Uses the new Supabase SSR libraries rather than the
deprecated auth helpers.

## Running locally

- Install the supabase cli: (https://supabase.com/docs/guides/cli/getting-started)
- Copy `.env.example` to `.env`
- Start supabase services in your project directory: `supabase start`
- Update the values for `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` with the values from
  the generated supabase services.
- Run your dev server: `npm run dev`

## Demonstration

- Navigate to the dev server at (http://localhost:5173)
- Either navigate to the protected route, or click 'sign in'. Either will bring you to the login
  page. (NOTE: you may experience a reload in development only when the supabase auth helper
  dependency is re-optimized by vite - this does not occur in production builds.)
- In the login page, enter a test email.
- Supabase sends email events in development to a locally hosted mail service at
  (http://localhost:54324/monitor). Click the link in the test email to log in.

## How it works

The supabase client is first initialized on the server in `hooks.server.ts` to load the
authentication information from the request. This client is attached to `event.locals` (defined in
`src/app.d.ts`) so that it can be used in any request handling functions.

The client is then used in the root layout server load function, `+layout.server.ts`, to provide the
session information to the browser client. The browser client is created in the root layout load
function, `+layout.ts`, and returned so that all child pages and routes can access the supabase
client and the session.

The root layout, `+layout.svelte`, subscribes to the supabase client's auth state changes and
triggers an invalidation of all auth information when necessary. This is done via a dependency
specified in appropriate areas on `supabase:auth`. This ensures that e.g. the auth guard on the
`/protected` route is re-run whenever a session change is detected, so the user can be navigated
away if they are no longer logged in.

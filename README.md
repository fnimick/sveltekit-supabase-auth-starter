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

## Magic Link Auth Notes

Magic links work by saving a code verifier in the browser that requests the link, and using that
along with the query params in the generated email link to verify the user.

This can cause problems when users open the link in a different browser or device than the one they
requested the link from - in particular, mobile app email clients use in-app browsers with different
cookie stores than the main browser, so the code verifier is not present and the link will not work.

To mitigate this, the `auth/callback` route conditionally renders a page if the code verifier is not
present in the browser's cookies, rather than immediately attempting to call
`supabase.auth.exchangeCodeForSession` which will fail if the code verifier is absent, and mark the
link as used in the process (meaning the user cannot recover from this error by opening the current
page in a new browser window). By deferring this call until the code verifier is present, we give
the user an opportunity to open the link in the correct browser or device.

To test this, open the magic link (from inbucket) in a different browser or device than the one you
requested it from. You should see a page with a message about the code verifier not being present.
Then, open the link in the same browser or device you requested it from, and you should be logged
in.

## Notes on session / user safety and object member use

Supabase recently added warnings when a `user` object is used from a fetched session on the server, since the
session is restored from cookies without being validated. This occurs even if the
user is validated (as they recommend) due to the way that the warning was implemented. See:
https://github.com/supabase/auth-js/issues/873

In this starter kit, the problem is resolved in the following way:

- in the server hooks, the session is fetched and the user is fetched, as supabase recommends, and
  then the fetched user is manually added to the session object, replacing the user warning proxy,
  so it can be safely used without warning. See `hooks.server.ts`
- in the layout code, if we are server-side rendering, we use the fetched session rather than
  re-fetching in the layout loader, as the supabase example does. This both avoids a second session
  fetch and and ensures that the most recent validated session, with the correct user property set,
  is used. See `routes/layout.ts`

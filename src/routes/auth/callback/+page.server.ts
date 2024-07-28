import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { redirect } from '@sveltejs/kit';

/**
 * Is the next URL a safe URL? (relative to our domain)
 */
function isSafe(nextUrl: string | null | undefined): nextUrl is string {
	// Prevent protocol-relative URLs - test for `//foo.bar`
	return (nextUrl && nextUrl[0] === '/' && nextUrl[1] !== '/') || false;
}

export async function load({ url, cookies, locals: { supabase } }) {
	// default storage key defined by
	// https://github.com/supabase/supabase-js/blob/4eb677aad51c47b160665c453a51bfdef20f0d49/src/SupabaseClient.ts#L85
	// and
	// https://github.com/supabase/gotrue-js/blob/15c7c8258b2d42d3378be4f7738c728a07523579/src/GoTrueClient.ts#L547
	const storageKey = `sb-${
		new URL(PUBLIC_SUPABASE_URL).hostname.split('.')[0]
	}-auth-token-code-verifier`;
	const codeVerifier = cookies.get(storageKey);
	const code = url.searchParams.get('code');
	const error = url.searchParams.get('error');

	if (error) {
		const description = url.searchParams.get('error_description');
		return { status: 'error', error, description };
	}
	if (codeVerifier == null) {
		return { status: 'missingCodeVerifier' };
	}
	if (code == null) {
		return { status: 'missingCode' };
	}

	const next = url.searchParams.get('next');

	if (!code) {
		redirect(303, '/auth/error');
	}

	try {
		const { error } = await supabase.auth.exchangeCodeForSession(code);
		if (error) {
			redirect(303, '/auth/error');
		}
		// https://github.com/supabase/gotrue-js/issues/782
	} catch {
		redirect(303, '/auth/error');
	}

	redirect(303, isSafe(next) ? next : '/');
}

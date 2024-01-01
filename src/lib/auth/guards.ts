import type { Session } from '@supabase/supabase-js';
import { redirect, type LoadEvent, type ServerLoadEvent } from '@sveltejs/kit';

export function requireUser(
	session: Session | null | undefined,
	event: LoadEvent | ServerLoadEvent
): asserts session is Session {
	event.depends('supabase:auth'); // recheck this when supabase auth state changes
	if (session == null) {
		const { pathname, search } = event.url;
		const redirectTo = `${pathname}${search}`;
		const urlSearchParams = new URLSearchParams();
		urlSearchParams.set('next', redirectTo);
		const searchParams = urlSearchParams.toString();
		redirect(302, `/auth?${searchParams}`);
	}
}

export function requireNoUser(
	session: Session | null | undefined,
	event: LoadEvent | ServerLoadEvent
): asserts session is null | undefined {
	event.depends('supabase:auth'); // recheck this when supabase auth state changes
	if (session != null) {
		redirect(302, '/');
	}
}

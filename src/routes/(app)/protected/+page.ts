import { requireUser } from '$lib/auth/guards';

export async function load(event) {
	const { session } = await event.parent();
	requireUser(session, event);
}

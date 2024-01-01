<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { derived, writable } from 'svelte/store';

	export let data;

	$: ({ supabase, session } = data);

	let supabaseStore = writable<typeof supabase>();
	$: supabaseStore.set(supabase);

	// this is necessary to ensure that subscriptions to old supabase clients are cleaned up properly
	// when a new client is retrieved from the loader.
	let supabaseAuthStateChangeSubscriptionStore = derived(supabaseStore, ($supabaseStore, set) => {
		const {
			data: { subscription }
		} = $supabaseStore.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		set(subscription);
		return subscription.unsubscribe;
	});

	onMount(() => {
		/* eslint-disable-next-line @typescript-eslint/no-empty-function */
		return supabaseAuthStateChangeSubscriptionStore.subscribe(() => {});
	});
</script>

<slot />

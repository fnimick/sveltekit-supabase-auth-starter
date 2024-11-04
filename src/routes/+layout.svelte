<script lang="ts">
	import { invalidate } from '$app/navigation';

	let { data, children } = $props();

	let { supabase, session } = $derived(data);

	$effect(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		// this is necessary to ensure that subscriptions to old supabase clients are cleaned up properly
		// when a new client is retrieved from the loader.
		return subscription.unsubscribe;
	});
</script>

{@render children?.()}

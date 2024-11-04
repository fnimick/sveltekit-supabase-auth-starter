<script lang="ts">
	import { invalidateAll } from '$app/navigation';

	let { data } = $props();

	let { session, supabase } = $derived(data);
</script>

<h1>Welcome to SvelteKit + Supabase</h1>
<p>
	<a href="protected">Navigate to a protected page</a>
</p>
<div>
	{#if session != null}
		<p>You are logged in as {session.user.email}</p>
		<button onclick={() => supabase.auth.signOut()}>Sign out</button>
	{:else}
		<a href="auth">Sign In</a>
	{/if}
	<button onclick={() => invalidateAll()}>invalidateAll</button>
</div>

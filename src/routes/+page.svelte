<script lang="ts">
	export let data;

	$: ({ session, supabase } = data);
</script>

<h1>Welcome to SvelteKit + Supabase</h1>
<p>
	<a href="protected">Navigate to a protected page</a>
</p>
<div>
	{#if session != null}
		<p>You are logged in as {session.user.email}</p>
		<button on:click={() => supabase.auth.signOut()}>Sign out</button>
	{:else}
		<a href="auth">Sign In</a>
	{/if}
</div>

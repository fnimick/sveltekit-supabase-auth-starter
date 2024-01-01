<script lang="ts">
	import { page } from '$app/stores';
	import { Auth } from '@supabase/auth-ui-svelte';
	import { ThemeSupa } from '@supabase/auth-ui-shared';

	$: next = $page.url.searchParams.get('next');

	$: redirectTo = next
		? `${$page.url.origin}/auth/callback?next=${encodeURIComponent(next)}`
		: `${$page.url.origin}/auth/callback`;
</script>

<svelte:head>
	<title>Sign In</title>
</svelte:head>

<div>
	<Auth
		supabaseClient={$page.data.supabase}
		theme="dark"
		view="magic_link"
		appearance={{
			theme: ThemeSupa
		}}
		{redirectTo}
		showLinks={false}
		additionalData={{}}
	/>
</div>

<style>
	div {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
	}
</style>

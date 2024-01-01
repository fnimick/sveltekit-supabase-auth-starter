<script lang="ts">
	import { page } from '$app/stores';

	$: searchParams = new URLSearchParams($page.url.hash.substring(1));

	// TODO: sentry log?
</script>

<div>
	<h1>An authentication error occurred. Please <a href="/auth">try again.</a></h1>

	<div>
		Details for engineering:
		<pre>{JSON.stringify([...searchParams?.entries()], null, 2)}</pre>
	</div>
</div>

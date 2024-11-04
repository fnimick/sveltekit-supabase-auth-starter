<script lang="ts">
	let { data } = $props();
</script>

{#if data.status === 'missingCodeVerifier'}
	<p>
		Please open this page in the browser you used to request the magic link in order to continue.
	</p>
	<p>
		If you are on a mobile device, please note that your email app may open links in its own
		internal browser. Please open this page in your primary browser in order to continue.
	</p>
{:else if data.status === 'missingCode'}
	<p>This magic link appears to be malformed. Please try again.</p>
{:else if data.status === 'error'}
	<p>An error occurred processing the magic link. Please request a new link and try again.</p>
	<pre>Error: {data.error}</pre>
	<pre>Description: {data.description}</pre>
{/if}

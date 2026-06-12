<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { fly } from 'svelte/transition';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div in:fly={{ y: 20, duration: 300 }} out:fly={{ y: -20, duration: 200 }}>
	{@render children()}
</div>

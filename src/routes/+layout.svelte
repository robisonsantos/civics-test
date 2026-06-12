<script lang="ts">
    import "./layout.css";
    import { pwaInfo } from 'virtual:pwa-info';

    let { children } = $props();
    let webManifestLink = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '');
</script>

<svelte:head>
    <link rel="icon" href="/favicon.ico" />
    {@html webManifestLink}
</svelte:head>
{@render children()}

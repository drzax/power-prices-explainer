<script lang="ts">
  import { decode, encode } from '@abcnews/base-36-props';

  import { Button, CodeSnippet, InlineNotification } from 'carbon-components-svelte';
  import { visState } from '../../lib/state.svelte';
  import { MARKERS } from '../../lib/constants';

  const importMarker = () => {
    const input = prompt('Paste a marker here to import its configuration');

    if (!input || !input.length) {
      return alert('No marker was provided');
    }

    const marker = input.slice(input.indexOf('CONFIG') + 6);

    try {
      visState.config = decode(marker);
    } catch (e) {
      alert('Could not decode input');
      console.error(e, input);
    }
  };

  let markersData = $derived(
    MARKERS.map(({ label, note, prefix }) => ({
      label,
      note,
      text: `#${prefix}CONFIG${encode(visState.config)}`
    }))
  );
</script>

<div>
  <Button size="field" tooltipAlignment="end" on:click={importMarker}>Import marker</Button>

  <Button
    size="field"
    tooltipAlignment="end"
    on:click={() => {
      // generateFallback($graph);
    }}
  >
    Download Fallback Image
  </Button>

  {#each markersData as { label, note, text }}
    <h4>{label}</h4>
    {#if note}
      <InlineNotification hideCloseButton kind="info" lowContrast subtitle={note} />
    {/if}
    <CodeSnippet type="single" code={text} />
  {/each}
</div>

<style>
  div :global(.bx--snippet--single) {
    height: auto;
  }

  div :global(pre) {
    white-space: initial;
  }

  div :global(code) {
    white-space: pre-wrap;
    word-break: break-all;
    overflow-wrap: break-word;
  }

  div :global(.bx--copy-btn) {
    height: 100%;
  }

  div :global(.bx--inline-notification) {
    max-width: unset !important;
  }
</style>

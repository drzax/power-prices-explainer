<script lang="ts">
  import type { DataSourceType, DeletableType } from '../../../lib/types';
  import FormActions from './FormActions.svelte';

  interface Props {
    source: (DataSourceType & DeletableType) | undefined;
  }

  let { source = $bindable() }: Props = $props();
</script>

{#if source}
  <label for="source-label">Label</label>
  <input id="source-label" type="text" bind:value={source.label} />
  <label for="source-url">URL (optional)</label>
  <input id="source-url" type="text" bind:value={source.url} />

  <FormActions bind:item={source} />
{/if}

<script lang="ts">
  import type { DeletableType, SeriesType } from '../../../lib/types';
  import FormActions from './FormActions.svelte';

  interface Props {
    line: (SeriesType & DeletableType) | undefined;
  }

  let { line = $bindable() }: Props = $props();
</script>

{#if line}
  <label for="line-id">ID</label>
  <input id="line-id" type="text" bind:value={line.id} />
  <label for="line-series">Series</label>
  <select bind:value={line.series}>
    <option value="excl">Excluding subsidies</option>
    <option value="incl">Including subsidies</option>
  </select>

  <FormActions bind:item={line} />
{/if}

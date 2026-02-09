<script lang="ts">
  import type { DeletableType, HighlightType } from '../../../lib/types';
  import FormActions from './FormActions.svelte';

  interface Props {
    highlight: (HighlightType & DeletableType) | undefined;
  }

  let { highlight = $bindable() }: Props = $props();
</script>

{#if highlight}
  <fieldset>
    <legend>Top left</legend>
    <label for="highlight-top-left-x">x</label>
    <input id="highlight-top-left-x" type="date" bind:value={highlight.tl.x} />
    <label for="highlight-top-left-y">y</label>
    <input id="highlight-to--left-y" type="number" bind:value={highlight.tl.y} />
  </fieldset>
  <fieldset>
    <legend>Bottom right</legend>
    <label for="highlight-bottom-right-x">x</label>
    <input id="highlight-bottom-right-x" type="date" bind:value={highlight.br.x} />
    <label for="highlight-bottom-right-y">y</label>
    <input id="highlight-bottom-right-y" type="number" bind:value={highlight.br.y} />
  </fieldset>

  <FormActions bind:item={highlight} />
{/if}

<style>
  fieldset {
    border: none;
    padding: 0;
    display: grid;
    grid-template-columns: auto auto;
    position: relative;

    legend {
      position: relative;
      display: block;
      grid-row: 1/3;
    }
  }
</style>

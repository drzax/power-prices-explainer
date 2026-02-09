<script lang="ts">
  import type { ArrowType, DeletableType } from '../../../lib/types';
  import FormActions from './FormActions.svelte';

  interface Props {
    arrow: (ArrowType & DeletableType) | undefined;
  }

  let { arrow = $bindable() }: Props = $props();
</script>

{#if arrow}
  <label for="annotation-text">from x</label>
  <input type="date" bind:value={arrow.from.x} />
  <label for="annotation-text">from y</label>
  <input type="number" bind:value={arrow.from.y} />
  <label for="annotation-text">to x</label>
  <input type="date" bind:value={arrow.to.x} />
  <label for="annotation-text">to y</label>
  <input type="number" bind:value={arrow.to.y} />

  <FormActions bind:item={arrow} />
{/if}

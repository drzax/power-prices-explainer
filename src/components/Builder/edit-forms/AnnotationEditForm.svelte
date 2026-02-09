<script lang="ts">
  import type { AnnotationType, DeletableType } from '../../../lib/types';
  import AnchorPointSelector from '../AnchorPointSelector.svelte';
  import FormActions from './FormActions.svelte';

  interface Props {
    annotation: (AnnotationType & DeletableType) | undefined;
  }

  let { annotation = $bindable() }: Props = $props();
</script>

{#if annotation}
  <label for="annotation-text">Label</label>
  <input id="annotation-text" type="text" bind:value={annotation.label} />
  <label for="x-position">x</label>
  <input id="x-position" type="date" bind:value={annotation.x} />
  <label for="y-position">y</label>
  <input id="y-position" type="number" bind:value={annotation.y} />
  <span>Anchor position</span>
  <AnchorPointSelector bind:value={annotation.anchor} />
  <label for="label-width">Width</label>
  <input id="label-width" type="number" min="5" max="100" bind:value={annotation.width} />em
  <FormActions bind:item={annotation} />
{/if}

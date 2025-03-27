<svelte:options namespace="svg" />

<script lang="ts">
  let {
    x,
    y,
    variant = 'circle',
    size = 'small'
  }: {
    x: number;
    y: number;
    orientation?: 'left' | 'right';
    text?: string;
    variant?: 'circle' | 'square' | 'diamond';
    size?: 'small' | 'large';
    offsetX?: number;
    offsetY?: number;
  } = $props();

  let side = $derived(size === 'small' ? 7 : 9);
  let diagonal = $derived(Math.sqrt(Math.pow(side, 2) * 2));
</script>

<g class="mark">
  {#if variant === 'square'}
    <rect x={x - side / 2} y={y - side / 2} width={side} height={side} />
  {:else if variant === 'diamond'}
    <polygon points="{x},{y - diagonal / 2} {x + diagonal / 2},{y} {x},{y + diagonal / 2} {x - diagonal / 2},{y}" />
  {:else}
    <circle cx={x} cy={y} r={side / 2} />
  {/if}
</g>

<style>
  .mark polygon,
  .mark circle,
  .mark rect {
    fill: var(--marker-color, currentColor);
  }
</style>

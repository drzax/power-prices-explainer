<svelte:options namespace="svg" />

<script lang="ts">
  let {
    x,
    y,
    variant = 'circle',
    size = 'sm'
  }: {
    x: number;
    y: number;
    orientation?: 'left' | 'right';
    text?: string;
    variant?: 'circle' | 'square' | 'diamond';
    size?: 'sm' | 'md' | 'lg';
    offsetX?: number;
    offsetY?: number;
  } = $props();

  const sizes = {
    sm: 7,
    md: 9,
    lg: 11
  };

  let side = $derived(sizes[size]);
  let diagonal = $derived(Math.sqrt(Math.pow(side, 2) * 2));
  let radius = $derived(side / 2);
</script>

<g class="mark">
  {#if variant === 'square'}
    <rect x={x - radius} y={y - radius} width={side} height={side} />
  {:else if variant === 'diamond'}
    <polygon points="{x},{y - diagonal / 2} {x + diagonal / 2},{y} {x},{y + diagonal / 2} {x - diagonal / 2},{y}" />
  {:else}
    <circle cx={x} cy={y} r={radius} />
  {/if}
</g>

<style>
  .mark polygon,
  .mark circle,
  .mark rect {
    fill: var(--marker-color, currentColor);
    stroke: var(--marker-outline-color, transparent);
    stroke-width: 1;
    opacity: var(--marker-opacity, 1);
  }
</style>

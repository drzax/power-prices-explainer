<svelte:options namespace="svg" />

<script lang="ts">
  import { fade } from 'svelte/transition';
  import { LARGE_TABLET_BREAKPOINT, DESKTOP_BREAKPOINT } from '../lib/constants';

  let {
    x,
    y,
    text,
    opacity = 1,
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

  let innerWidth = $state(0);

  let sizes = $state({
    sm: 7,
    md: 9,
    lg: 11
  });

  $effect(() => {
    // console.log(innerWidth, LARGE_TABLET_BREAKPOINT);
    if (innerWidth > LARGE_TABLET_BREAKPOINT) {
      sizes = {
        sm: 9,
        md: 11,
        lg: 13,
      };
    }
  });

  let side = $derived(sizes[size]);
  let diagonal = $derived(Math.sqrt(Math.pow(side, 2) * 2));
  let radius = $derived(side / 2);
</script>

<svelte:window bind:innerWidth />

<g class="mark" transition:fade={{ delay: 400 }}>
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

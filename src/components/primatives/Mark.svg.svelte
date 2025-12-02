<svelte:options namespace="svg" />

<script lang="ts">
  import { fade } from 'svelte/transition';
  import { LARGE_TABLET_BREAKPOINT, DESKTOP_BREAKPOINT } from '../../lib/constants';
  import Polygon from './Polygon.svg.svelte';

  let {
    x,
    y,
    text,
    variant = 'triangle',
    size = 'sm',
    disableResponsiveSizing = false
  }: {
    x: number;
    y: number;
    orientation?: 'left' | 'right';
    text?: string;
    variant?: 'circle' | 'square' | 'diamond' | 'triangle';
    size?: 'sm' | 'md' | 'lg';
    offsetX?: number;
    offsetY?: number;
    disableResponsiveSizing?: boolean;
  } = $props();
  console.log('x :>> ', x);
  let innerWidth = $state(0);

  let sizes = $state({
    sm: 7,
    md: 9,
    lg: 11
  });

  $effect(() => {
    if (innerWidth > LARGE_TABLET_BREAKPOINT && !disableResponsiveSizing) {
      sizes = {
        sm: 9,
        md: 11,
        lg: 13
      };
    } else if (innerWidth > DESKTOP_BREAKPOINT && !disableResponsiveSizing) {
      sizes = {
        sm: 11,
        md: 13,
        lg: 15
      };
    }
  });

  let side = $derived(sizes[size]);
  let diagonal = $derived(Math.sqrt(Math.pow(side, 2) * 2) * 0.9);
  let radius = $derived(side / 2);
</script>

<svelte:window bind:innerWidth />

<g class="mark {text}" in:fade|global={{ delay: 0 }} out:fade|global={{ delay: 0 }}>
  {#if variant === 'square'}
    <rect x={x - radius} y={y - radius} width={side * 0.9} height={side * 0.9} />
  {:else if variant === 'diamond'}
    <polygon points="{x},{y - diagonal / 2} {x + diagonal / 2},{y} {x},{y + diagonal / 2} {x - diagonal / 2},{y}" />
  {:else if variant === 'circle'}
    <circle cx={x} cy={y} r={radius} />
  {:else if variant === 'triangle'}
    <Polygon
      --polygon-stroke-width="1px"
      --polygon-outline-color="#444"
      --polygon-color="#fff"
      rotation={30}
      {radius}
      cx={x}
      cy={y}
    />
  {/if}
</g>

<style>
  .mark polygon,
  .mark circle,
  .mark rect {
    fill: var(--marker-color, currentColor);
    stroke: var(--marker-outline-color, transparent);
    stroke-width: 1.5;
    opacity: var(--marker-opacity, 1);
  }
</style>

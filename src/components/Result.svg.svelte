<svelte:options namespace="svg" />

<script lang="ts">
  import { Tween } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { parties } from '../lib/constants';
  import { getTernaryCoordinatesFromResult } from '../lib/data-accessors';
  import { visState } from '../lib/state.svelte';
  import type { ResultType } from '../lib/types';
  import Mark from './primatives/Mark.svg.svelte';

  let { data, size, opacity }: { data: ResultType; size: 'sm' | 'md' | 'lg'; opacity?: number } = $props();

  const opts = {
    duration: 1500,
    easing: cubicOut
  };
  let x = new Tween(0, opts);
  let y = new Tween(0, opts);
  let markerOpacity = $derived(opacity ? opacity : visState.config.resultMarkerOpacity);
</script>

{#if x.current !== 0 && y.current !== 0}
  <Mark {size} --marker-opacity={markerOpacity} x={x.current} y={y.current} />
{/if}

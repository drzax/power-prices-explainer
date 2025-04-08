<svelte:options namespace="svg" />

<script lang="ts">
  import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
  import { parties } from '../lib/constants';
  import { getTernaryCoordinatesFromResult } from '../lib/data-accessors';
  import { ternaryToCartesian, visState } from '../lib/state.svelte';
  import type { ResultType, ShapesType } from '../lib/types';
  import Mark from './Mark.svg.svelte';

  let { data, size }: { data: ResultType; size: 'sm' | 'md' | 'lg' } = $props();

  const opts = {
		duration: 1500,
		easing: cubicOut
	};
	let x = new Tween(0, opts);
  let y = new Tween(0, opts);
  let variant = $derived(parties.get(data.PartyAb.toLocaleLowerCase())?.shape || 'none');

  $effect(() => {
    const coords = ternaryToCartesian(getTernaryCoordinatesFromResult(data));
    if (x.current === 0 && y.current === 0) {
      x.set(coords.x, { duration: 0 })
      y.set(coords.y, { duration: 0 })
    } else {
      x.target = coords.x;
      y.target = coords.y;
    }
  });
</script>

{#if variant !== 'none' && x.current !== 0 && y.current !== 0}
  <Mark
    {size}
    --marker-color="var(--pty-color-{data.PartyAb.toLowerCase()})"
    --marker-opacity={visState.config.resultMarkerOpacity}
    x={x.current}
    y={y.current}
    {variant}
  />
{/if}

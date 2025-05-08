<svelte:options namespace="svg" />

<script lang="ts">
  import { Tween } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { parties } from '../lib/constants';
  import { getTernaryCoordinatesFromResult } from '../lib/data-accessors';
  import { ternaryToCartesian, visState } from '../lib/state.svelte';
  import type { ResultType } from '../lib/types';
  import Mark from './Mark.svg.svelte';

  let { data, size, opacity }: { data: ResultType; size: 'sm' | 'md' | 'lg'; opacity?: number } = $props();

  const opts = {
    duration: 1500,
    easing: cubicOut
  };
  let x = new Tween(0, opts);
  let y = new Tween(0, opts);
  let party = $derived(data.PartyAb.toLocaleLowerCase());
  let markerOpacity = $derived(opacity ? opacity : visState.config.resultMarkerOpacity);

  $effect(() => {
    const coords = ternaryToCartesian(getTernaryCoordinatesFromResult(data));
    // Don't tween in from null results
    if (x.current === 0 && y.current === 0) {
      x.set(coords.x, { duration: 0 });
      y.set(coords.y, { duration: 0 });
    } else {
      x.target = coords.x;
      y.target = coords.y;
    }
  });

  let variant: 'circle' | 'square' | 'diamond' | 'triangle' = $derived.by(() => {
    // For undecided seats, use the variant of the highest primary vote (they'll be greyed out)
    if (party === 'tooclose') {
      const [OTH, ALP, LNP] = getTernaryCoordinatesFromResult(data);
      if (OTH > ALP && OTH > LNP) {
        return 'diamond';
      }
      if (LNP > ALP && LNP > OTH) {
        return 'square';
      }
      return 'circle';
    }

    if (party === 'in doubt') {
      return 'triangle';
    }

    return parties.get(party)?.shape || 'triangle';
  });
</script>

{#if x.current !== 0 && y.current !== 0}
  <Mark
    {size}
    --marker-color="var(--pty-color-{data.PartyAb.toLowerCase()})"
    --marker-opacity={markerOpacity}
    x={x.current}
    y={y.current}
    {variant}
  />
{/if}

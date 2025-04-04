<svelte:options namespace="svg" />

<script lang="ts">
  import { parties } from '../lib/constants';
  import { getTernaryCoordinatesFromResult } from '../lib/data-accessors';
  import { ternaryToCartesian, visState } from '../lib/state.svelte';
  import type { ResultType, ShapesType } from '../lib/types';
  import Mark from './Mark.svg.svelte';

  let { data, size }: { data: ResultType; size: 'sm' | 'md' | 'lg' } = $props();

  let variant: ShapesType = $derived(parties.get(data.PartyAb.toLocaleLowerCase())?.shape || 'circle');
</script>

<Mark
  {size}
  --marker-color="var(--pty-color-{data.PartyAb.toLowerCase()})"
  --marker-opacity={visState.config.resultMarkerOpacity}
  {...ternaryToCartesian(getTernaryCoordinatesFromResult(data))}
  {variant}
/>

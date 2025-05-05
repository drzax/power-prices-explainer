<svelte:options namespace="svg" />

<script lang="ts">
  import { getTernaryCoordinatesFromResult } from '../lib/data-accessors';
  import { ternaryToCartesian } from '../lib/state.svelte';
  import { distance, unitVector } from '../lib/trig';

  let { results } = $props();
  let polyline = $derived(
    results
      .sort((a, b) => a.Year - b.Year)
      .map((result, i, arr) => {
        const coords = ternaryToCartesian(getTernaryCoordinatesFromResult(result));
        if (i === arr.length - 1 && arr.length > 1) {
          const previousCoords = ternaryToCartesian(getTernaryCoordinatesFromResult(arr[i - 1]));
          const d = distance(previousCoords, coords) - 8;
          const v = unitVector(previousCoords, coords);

          return `${previousCoords.x - d * v.x},${previousCoords.y - d * v.y}`;
        }
        return `${coords.x},${coords.y}`;
      })
      .join(' ')
  );
</script>

<polyline
  points={polyline}
  stroke="black"
  fill="none"
  stroke-dasharray="3 4"
  stroke-width="2"
  stroke-linecap="round"
  stroke-dashoffset="-10"
  marker-end="url(#arrow)"
/> />

<svelte:options namespace="svg" />

<script lang="ts">
  import { fade } from 'svelte/transition';
  import { arcPathBetweenCircles } from '../lib/trig';

  let {
    markerPosition,
    labelPosition
  }: { markerPosition: { x: number; y: number; r: number }; labelPosition: { x: number; y: number; r: number } } =
    $props();

  let arcPath = $derived(arcPathBetweenCircles(markerPosition, labelPosition));
</script>

<g transition:fade>
  <circle cx={markerPosition.x} cy={markerPosition.y} r={markerPosition.r} fill="none" stroke="black" />
  <path d={arcPath} fill="none" stroke="black" />
</g>

<style>
</style>

<svelte:options namespace="svg" />

<script>
  import { fade } from 'svelte/transition';
  import { calculateRoundedCorners, regularPolygonVertices, rotate, translate } from '../lib/trig';
  let { radius = 100, fillet = 0, sides = 3, rotation = 0, cx = 0, cy = 0, id = null } = $props();
  let coords = $derived(
    calculateRoundedCorners(regularPolygonVertices(sides, radius), fillet).map(coords => {
      return {
        ...coords,
        arcStart: translate(rotate(coords.arcStart, rotation), { x: cx, y: cy }),
        arcEnd: translate(rotate(coords.arcEnd, rotation), { x: cx, y: cy }),
        center: translate(rotate(coords.center, rotation), { x: cx, y: cy })
      };
    })
  );
</script>

<path
  transition:fade
  {id}
  d="M{coords
    .map(
      ({ arcStart, arcEnd }) => `${arcStart.x} ${arcStart.y}A${fillet} ${fillet} 0 0 1 ${arcEnd.x}
  ${arcEnd.y}`
    )
    .join('L')}Z"
/>

<style>
  path {
    fill: var(--polygon-color, transparent);
    stroke: var(--polygon-outline-color, transparent);
    stroke-width: 1;
  }
</style>

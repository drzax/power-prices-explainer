<svelte:options namespace="svg" />

<script>
  import { calculateRoundedCorners, regularPolygonVertices } from '../lib/trig';

  let { radius = 100, fillet = 0, sides = 3, rotation = 0, cx = 0, cy = 0 } = $props();

  let verticies = $derived.by(() => regularPolygonVertices(sides, radius));

  let coords = $derived(calculateRoundedCorners(verticies, fillet));
</script>

<g transform={`translate(${cx} ${cy}) rotate(${rotation})`} transform-origin="{cx},{cy}">
  <path
    d="M{coords
      .map(
        ({ arcStart, arcEnd }) => `${arcStart.x} ${arcStart.y}A${fillet} ${fillet} 0 0 1 ${arcEnd.x}
  ${arcEnd.y}`
      )
      .join('L')}Z"
    stroke="black"
    fill="none"
  />
</g>

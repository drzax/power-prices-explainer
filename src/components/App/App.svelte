<script lang="ts">
  import { getSegmentPolygons, regularPolygonVertices } from '../../lib/trig';
  import Polygon from '../Polygon.svg.svelte';

  let radius = $state(50);
  let fillet = $state(5);
  let sides = $state(3);
  let rotation = $state(0);

  let segments = $derived.by(() => {
    let vertices = regularPolygonVertices(sides, radius);
    return getSegmentPolygons(vertices);
  });

  let axies = $derived.by(() => {
    return segments.map(([start, end]) => [start, end]);
  });
</script>

<div>
  <svg
    viewBox="0 0 {radius * 2} {radius * 2}"
    xmlns="http://www.w3.org/2000/svg"
    width={radius * 2}
    height={radius * 2}
  >
    <Polygon {radius} {fillet} {sides} {rotation} cx={radius} cy={radius} />
    <g transform={`translate(${radius} ${radius}) rotate(${rotation})`} transform-origin="{radius},{radius}">
      {#each segments as segment, i}
        <path d={`M${segment.map(({ x, y }) => `${x} ${y}`).join('L')}Z`} fill="none" stroke="grey" />
      {/each}
      ${#each axies as [start, end], i}
        <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="red" />
      {/each}
    </g>
  </svg>
  <input type="range" bind:value={sides} min={3} max={100} />
  {sides}
  <input type="range" bind:value={radius} min={3} max={100} />
  {radius}
  <input type="range" bind:value={fillet} min={0} max={100} />
  {fillet}
  <input type="range" bind:value={rotation} min={0} max={360} />
  {rotation}
</div>

<style lang="scss">
  div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    min-height: 320px;
    background-color: #3178c7;
    color: #fff;
    text-align: center;
  }
</style>

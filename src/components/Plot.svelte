<script lang="ts">
  import Polygon from './Polygon.svg.svelte';
  import { distance, getSegmentPolygons, regularPolygonVertices, rotate, translate } from '../lib/trig';
  import { visState } from '../lib/state.svelte';
  import Svg from './Svg.svelte';

  const plot = visState.dimensions;

  interface Props {
    displayCentralZone?: boolean;
    segments: { id: string; label: string; gradientStops: { offset: string; color: string }[] }[];
    [key: string]: unknown;
  }

  let { children, displayCentralZone = false, segments }: Props = $props();

  const sides = $derived(segments.length);
  const fillet = 5;
  const rotation = 30;

  let radius = $derived(Math.min(plot.width, plot.height) / 2);

  let segmentPolygons = $derived(
    getSegmentPolygons(
      regularPolygonVertices(sides, radius).map(v =>
        translate(rotate(v, rotation), { x: plot.width / 2, y: plot.height / 2 })
      )
    )
  );
  let axies = $derived(segmentPolygons.map(([start, end]) => [start, end]));
  $effect(() => {
    plot.axisLength = distance(axies[0][0], axies[0][1]);
  });

  const labels = [
    { text: 'Test 2025 1', x: 100, y: 10, offsetX: 50, offsetY: 30 },
    { text: 'Test 2025 2', orientation: 'left', x: 100, y: 30 },

    { text: 'Test 2025 3', orientation: 'left', x: 100, y: 50, variant: 'square' },

    { text: 'Test 2025 4', orientation: 'right', x: 100, y: 70, variant: 'diamond' },
    {
      text: 'Test 2025 5',
      x: 100,
      y: 200,
      variant: 'square',
      size: 'large',
      offsetY: -50,
      offsetX: 30
    },
    {
      text: 'Test 2025 6',
      x: 400,
      y: 200,
      variant: 'square',
      size: 'large',
      offsetY: 50,
      offsetX: -30
    }
  ];
</script>

<div class="plot" bind:clientWidth={plot.width} bind:clientHeight={plot.height}>
  <Svg>
    <defs>
      {#each segments as { id, gradientStops }, i}
        <linearGradient
          id="gradient-{id}"
          gradientUnits="userSpaceOnUse"
          x1={segmentPolygons[i][0].x}
          y1={segmentPolygons[i][0].y}
          x2={segmentPolygons[i][2].x}
          y2={segmentPolygons[i][2].y}
        >
          {#each gradientStops as { offset, color }}
            <stop {offset} stop-color={color} />
          {/each}
        </linearGradient>
      {/each}
      <clipPath id="ternary-mask">
        <Polygon {radius} {fillet} {sides} {rotation} cx={plot.width / 2} cy={plot.height / 2} />
      </clipPath>
    </defs>

    {#each segmentPolygons as segment, i}
      <path
        clip-path="url(#ternary-mask)"
        d={`M${segment.map(({ x, y }) => `${x} ${y}`).join('L')}Z`}
        fill="url(#gradient-{segments[i].id})"
        class="segment {segments[i].id}"
      />
    {/each}

    {#if displayCentralZone}
      <Polygon
        {sides}
        radius={plot.axisLength}
        cx={plot.width / 2}
        cy={plot.height / 2}
        rotation={rotation + 180 / sides}
        --polygon-color="var(--central-zone-colour, rgba(255,255,255,0.5))"
      />
    {/if}

    ${#each axies as [start, end], i}
      <line class="axis" x1={start.x} y1={start.y} x2={end.x} y2={end.y} />
    {/each}
  </Svg>

  {@render children?.()}
</div>

<style>
  .plot {
    position: relative;
    width: 50vw;
    height: 50vh;
    margin: 2rem auto;
  }
  .axis {
    stroke: #000;
    stroke-opacity: 0.2;
    stroke-width: 1px;
  }
</style>

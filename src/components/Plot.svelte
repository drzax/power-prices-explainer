<script lang="ts">
  import Polygon from './Polygon.svg.svelte';
  import {
    distance,
    getPolygonPositionAndSize,
    getSegmentPolygons,
    regularPolygonVertices,
    rotate,
    translate,
    unitVector
  } from '../lib/trig';
  import { plotMargins } from '../lib/constants';
  import { visState } from '../lib/state.svelte';
  import Svg from './Svg.svelte';
  import Html from './Html.svelte';
  import AxisLabel from './AxisLabel.svelte';

  const plot = visState.dimensions;

  interface Props {
    displayCentralZone?: boolean;
    displayAxes?: boolean;
    displayOutline?: boolean;
    displaySegments?: boolean;
    segments: { id: string; label: string; gradientStops: { offset: string; color: string }[] }[];
    [key: string]: unknown;
  }

  let {
    children,
    displayCentralZone = false,
    displayAxes = true,
    displayOutline = true,
    displaySegments = false,
    segments
  }: Props = $props();

  const sides = $derived(segments.length);
  const fillet = 5;
  const rotation = 30;

  let { width, height } = $derived({
    width: plot.width - plotMargins.left - plotMargins.right,
    height: plot.height - plotMargins.top - plotMargins.bottom
  });

  let { radius, center } = $derived(getPolygonPositionAndSize(width, height, rotation, sides));

  let vertices = $derived(
    regularPolygonVertices(sides, radius).map(v =>
      translate(rotate(v, rotation), { x: center.x + plotMargins.left, y: center.y + plotMargins.top })
    )
  );

  let segmentPolygons = $derived(getSegmentPolygons(vertices));

  let axies = $derived(segmentPolygons.map(([start, end]) => [start, end]));
  $effect(() => {
    plot.axisLength = distance(axies[0][0], axies[0][1]);
  });
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
        <Polygon
          {radius}
          {fillet}
          {sides}
          {rotation}
          cx={center.x + plotMargins.left}
          cy={center.y + plotMargins.top}
        />
      </clipPath>
    </defs>
    {#if displaySegments}
      {#each segmentPolygons as segment, i}
        <path
          clip-path="url(#ternary-mask)"
          d={`M${segment.map(({ x, y }) => `${x} ${y}`).join('L')}Z`}
          fill="url(#gradient-{segments[i].id})"
          class="segment {segments[i].id}"
        />
      {/each}
    {/if}

    {#if displayCentralZone}
      <Polygon
        {sides}
        radius={plot.axisLength}
        cx={center.x + plotMargins.left}
        cy={center.y + plotMargins.top}
        rotation={rotation + 180 / sides}
        --polygon-color="var(--central-zone-colour, rgba(255,255,255,0.5))"
      />
    {/if}

    {#if displayAxes}
      ${#each axies as [start, end]}
        <line class="axis" x1={start.x} y1={start.y} x2={end.x} y2={end.y} />
      {/each}
    {/if}

    {#if displayOutline}
      <Polygon
        --polygon-outline-color="#000"
        {sides}
        {radius}
        {fillet}
        cx={center.x + plotMargins.left}
        cy={center.y + plotMargins.top}
        {rotation}
      />
    {/if}
  </Svg>
  <Html>
    {#each vertices as { x, y }, i}
      <AxisLabel
        --label-color="var(--pty-color-text-{segments[(i + 2) % sides].id})"
        text={visState.config.axisLabels[(i + 1) % sides] || segments[(i + 2) % sides].label}
        {x}
        {y}
        vector={unitVector({ x: center.x + plotMargins.left, y: center.y + plotMargins.top }, { x, y })}
      />
    {/each}
  </Html>

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

<script lang="ts">
  import Polygon from './Polygon.svg.svelte';
  import { getSegmentPolygons, regularPolygonVertices, rotate, translate } from '../lib/trig';

  import { plot } from '../lib/state.svelte';
  import Arrow from './Arrow.svg.svelte';
  import Mark from './Mark.svg.svelte';
  import Svg from './Svg.svelte';
  import Html from './Html.svelte';
  import Label from './Label.svelte';
  import LabelConnector from './LabelConnector.svelte';
  import { parties } from '../lib/constants';

  let { children, data } = $props();

  const sides = 3;
  const fillet = 5;
  const rotation = 30;

  let radius = $derived(Math.min(plot.width, plot.height) / 2);

  let segments = $derived(
    getSegmentPolygons(
      regularPolygonVertices(sides, radius).map(v =>
        translate(rotate(v, rotation), { x: plot.width / 2, y: plot.height / 2 })
      )
    )
  );
  let axies = $derived(segments.map(([start, end]) => [start, end]));

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
      {#each parties as { id, gradientStops }, i}
        <linearGradient
          id="gradient-{id}"
          gradientUnits="userSpaceOnUse"
          x1={segments[i][0].x}
          y1={segments[i][0].y}
          x2={segments[i][2].x}
          y2={segments[i][2].y}
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

    {#each segments as segment, i}
      <path
        clip-path="url(#ternary-mask)"
        d={`M${segment.map(({ x, y }) => `${x} ${y}`).join('L')}Z`}
        fill="url(#gradient-{parties[i].id})"
        class="segment {parties[i].id}"
      />
    {/each}

    ${#each axies as [start, end], i}
      <line class="axis" x1={start.x} y1={start.y} x2={end.x} y2={end.y} />
    {/each}

    <g transform={`translate(${plot.width / 2} ${plot.height / 2})`}>
      <Arrow length={30} width={5} headAngle={35} headLength={10} />
    </g>
  </Svg>

  <Svg>
    {#each labels as { x, y, variant, size }}
      <Mark {x} {y} {variant} {size} />
    {/each}
    {#each labels.filter(d => d.offsetX || d.offsetY) as { x, y, offsetX, offsetY, text, size }}
      <LabelConnector
        labelPosition={{ x: x + (offsetX || 0), y: y + (offsetY || 0), r: size === 'large' ? 12 : 11 }}
        markerPosition={{ x, y, r: size === 'large' ? 9 : 8 }}
      />
    {/each}
  </Svg>
  <Html>
    {#each labels as { x, y, orientation, text, offsetX, offsetY }}
      <Label x={x + (offsetX || 0)} y={y + (offsetY || 0)} {orientation} {text} />
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

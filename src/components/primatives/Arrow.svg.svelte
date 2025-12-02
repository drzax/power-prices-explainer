<script lang="ts">
  import { distance, generateArrowPath, unitVector } from '../../lib/trig';

  type Coordinate = { x: number; y: number };

  let { from, to, lineWidth = 2 }: { from: Coordinate; to: Coordinate; lineWidth: number } = $props();

  // let { length = 10, width = 3, headAngle = 30, headLength = 4, rounding = 1, px = 100, py = 100 } = $props();

  const HEAD_LENGTH = 7;
  const HEAD_ANGLE = 45;
  const ROUNDING = 1;

  let d = $derived(distance(from, to));
  let uv = $derived(unitVector(from, to));
  let vertices = $derived(generateArrowPath(d, lineWidth, HEAD_ANGLE, HEAD_LENGTH, ROUNDING));
  let path = $derived(`${vertices.map(({ prefix, x, y }) => `${prefix} ${x} ${y}`).join('')} Z`);
  let rotation = $derived(Math.atan2(uv.y, uv.x) * (180 / Math.PI));
  $effect(() => {});
</script>

<path d={path} transform-origin="left middle" style:transform="translate({to.x}px,{to.y}px) rotate({rotation}deg)" />

<style>
  path {
    stroke: var(--arrow-stroke-color, transparent);
    stroke-width: var(--arrow-stroke-width, 1);
    fill: var(--arrow-fill-color, black);
  }
</style>

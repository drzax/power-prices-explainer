<script>
  import { distance, generateArrowPath, unitVector } from '../../lib/trig';

  let { from, to, lineWidth } = $props();

  // let { length = 10, width = 3, headAngle = 30, headLength = 4, rounding = 1, px = 100, py = 100 } = $props();

  const LINE_WIDTH = 5;
  const HEAD_LENGTH = 20;

  let d = $derived(distance(from, to));
  let uv = $derived(unitVector(from, to));
  let vertices = $derived(generateArrowPath(d, LINE_WIDTH, 45, HEAD_LENGTH, 1));
  let path = $derived(`${vertices.map(({ prefix, x, y }) => `${prefix} ${x} ${y}`).join('')} Z`);
  let rotation = $derived(Math.atan2(uv.y, uv.x) * (180 / Math.PI));
  $effect(() => {});
</script>

<path d={path} transform-origin="left middle" style:transform="translate({to.x}px,{to.y}px) rotate({rotation}deg)" />

<style>
  path {
    stroke: var(--arrow-stroke-color, transparent);
    stroke-width: var(--arrow-stroke-width, 1);
    fill: var(--arrow-fill-color, white);
  }
</style>

<script>
  import { generateArrowPath } from '../lib/trig';

  let { length = 10, width = 3, headAngle = 30, headLength = 4, rounding = 1, px = 100, py = 100 } = $props();
</script>

<path
  d={generateArrowPath(length, width, headAngle, headLength, rounding, px, py)}
  fill="black"
  stroke="red"
  transform-origin="left middle"
/>

<svelte:options namespace="svg" />

<script lang="ts">
  import Rule from '../primatives/Rule.svg.svelte';

  interface Props {
    scale: (input: Date | number) => number;
    orient: 'top' | 'bottom' | 'left' | 'right';
  }

  const { scale, orient }: Props = $props();
</script>

<g class="axis x-axis">
  {#each tickVals as tick, i (tick)}
    {#if baseline === true}
      <line class="baseline" y1={$height} y2={$height} x1="0" x2={$width} />
    {/if}

    <g class="tick tick-{i}" transform="translate({$xScale(tick)},{Math.max(...$yRange)})">
      {#if gridlines === true}
        <line class="gridline" x1={halfBand} x2={halfBand} y1={-$height} y2="0" />
      {/if}
      {#if tickMarks === true}
        <line class="tick-mark" x1={halfBand} x2={halfBand} y1={tickGutter} y2={tickGutter + tickLen} />
      {/if}
      <text x={halfBand} y={tickGutter + tickLen} {dx} {dy} text-anchor={textAnchor(i, snapLabels)}>{format(tick)}</text
      >
    </g>
  {/each}
</g>

<style>
  .tick {
    font-size: 11px;
  }

  line,
  .tick line {
    stroke: #aaa;
    stroke-dasharray: 2;
  }

  .tick text {
    fill: #666;
  }

  .tick .tick-mark,
  .baseline {
    stroke-dasharray: 0;
  }
  /* This looks slightly better */
  .axis.snapLabels .tick:last-child text {
    transform: translateX(3px);
  }
  .axis.snapLabels .tick.tick-0 text {
    transform: translateX(-3px);
  }
</style>

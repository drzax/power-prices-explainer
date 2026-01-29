<script>
  import { getContext } from 'svelte';
  import { visState } from '../../lib/state.svelte';
  import Html from '../primatives/Html.svelte';
  import Arrow from '../primatives/Arrow.svg.svelte';
  import { Svg } from 'layercake';

  const { width, height, xScale, yScale } = getContext('LayerCake');
  const offset = 2;
  const clipPath = $derived.by(() => {
    return `M-${offset},-${offset} h${$width + offset * 2} v${$height + offset * 2} h-${$width + offset * 2} Z ${visState.config.highlights
      .map(h => {
        const coords = [
          [Math.max(0, $xScale(new Date(h.tl.x))), Math.max(0, $yScale(h.tl.y))],
          [Math.min($width, $xScale(new Date(h.br.x))), Math.max(0, $yScale(h.tl.y))],
          [Math.min($width, $xScale(new Date(h.br.x))), Math.min($height, $yScale(h.br.y))],
          [Math.max(0, $xScale(new Date(h.tl.x))), Math.min($height, $yScale(h.br.y))]
        ];
        return `M ${coords.map(d => d.join(',')).join(' ')} Z`;
      })
      .join(' ')}`;
  });
</script>

<Svg>
  {#if visState.config.highlights.length > 0}
    <rect
      class="shroud"
      x={-offset}
      y={-offset}
      width={$width + offset * 2}
      height={$height + offset * 2}
      style:clip-path={`path("${clipPath}") view-box`}
      style:clip-rule="evenodd"
    />
  {/if}
</Svg>

<style>
  .shroud {
    fill: rgba(255, 255, 255, 0.6);
    clip-rule: evenodd;
  }
</style>

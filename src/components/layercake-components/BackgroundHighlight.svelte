<script>
  import { getContext } from 'svelte';
  import { visState } from '../../lib/state.svelte';
  import Html from '../primatives/Html.svelte';
  import Arrow from '../primatives/Arrow.svg.svelte';
  import { fade } from 'svelte/transition';

  const { width, height, xScale, yScale } = getContext('LayerCake');
</script>

<Html>
  {#each visState.config.highlights.filter(d => !d.deleted) as highlight}
    <div
      class="highlight"
      transition:fade
      style:left={`${$xScale(new Date(highlight.tl.x))}px`}
      style:top={`${$yScale(highlight.tl.y)}px`}
      style:width={`${$xScale(new Date(highlight.br.x)) - $xScale(new Date(highlight.tl.x))}px`}
      style:height={`${$yScale(highlight.br.y) - $yScale(highlight.tl.y)}px`}
    ></div>
  {/each}
</Html>

<style>
  .highlight {
    position: absolute;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
</style>

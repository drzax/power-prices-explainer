<script>
  import { getContext } from 'svelte';
  import { visState } from '../../lib/state.svelte';
  import Html from '../primatives/Html.svelte';

  const { width, height, xScale, yScale } = getContext('LayerCake');
</script>

<Html>
  {#each visState.config.annotations as annotation}
    <span style:left={`${$xScale(annotation.x)}px`} style:top={`${$yScale(annotation.y)}px`}>{annotation.label}</span>
  {/each}
</Html>

<style>
  span {
    position: absolute;
    text-align: center;
    vertical-align: middle;
    max-width: 30%;
  }
</style>

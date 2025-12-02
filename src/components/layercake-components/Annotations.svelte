<script>
  import { getContext } from 'svelte';
  import { visState } from '../../lib/state.svelte';
  import Html from '../primatives/Html.svelte';

  $effect(() => {
    console.log('visState.config.annotations :>> ', visState.config.annotations);
  });

  const { width, height, xScale, yScale } = getContext('LayerCake');
</script>

<Html>
  {#each visState.config.annotations as annotation}
    <span
      style={`position: absolute; left: ${
        $xScale(annotation.x) + (visState.config.padding.left || visState.config.padding)
      }px; top: ${$yScale(annotation.y) + (visState.config.padding.top || visState.config.padding)}px`}
      >{annotation.label}</span
    >
  {/each}
</Html>

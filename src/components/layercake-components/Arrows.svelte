<script>
  import { getContext } from 'svelte';
  import { visState } from '../../lib/state.svelte';
  import Html from '../primatives/Html.svelte';
  import Arrow from '../primatives/Arrow.svg.svelte';
  import { Svg } from 'layercake';

  const { width, height, xScale, yScale } = getContext('LayerCake');
  $effect(() => {
    visState.config.arrows.forEach(arrow => {});
  });
</script>

<Svg>
  {#each visState.config.arrows as arrow}
    <Arrow
      from={{ x: $xScale(new Date(arrow.from.x)), y: $yScale(arrow.from.y) }}
      to={{ x: $xScale(new Date(arrow.to.x)), y: $yScale(arrow.to.y) }}
    />
  {/each}
</Svg>

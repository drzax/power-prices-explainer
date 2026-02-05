<script>
  import { getContext } from 'svelte';
  import { visState } from '../../lib/state.svelte';
  import Html from '../primatives/Html.svelte';
  import { AnnotationAnchorType } from '../../lib/types';

  const { width, height, xScale, yScale, custom } = getContext('LayerCake');

  $effect(() => console.log('visState.config.annotations :>> ', visState.config.annotations));
</script>

<Html>
  {#each visState.config.annotations as annotation}
    <span
      class:show-construction-marks={$custom.showConstructionMarks}
      style:left={`${$xScale(new Date(annotation.x))}px`}
      style:top={`${$yScale(annotation.y)}px`}
      style:width={`${annotation.width}em`}
      class:middle={annotation.anchor === AnnotationAnchorType.Middle}
      class:top-left={annotation.anchor === AnnotationAnchorType.TopLeft}
      class:top={annotation.anchor === AnnotationAnchorType.Top}
      class:top-right={annotation.anchor === AnnotationAnchorType.TopRight}
      class:right={annotation.anchor === AnnotationAnchorType.Right}
      class:bottom-right={annotation.anchor === AnnotationAnchorType.BottomRight}
      class:bottom={annotation.anchor === AnnotationAnchorType.Bottom}
      class:bottom-left={annotation.anchor === AnnotationAnchorType.BottomLeft}
      class:left={annotation.anchor === AnnotationAnchorType.Left}
    >
      {annotation.label}
    </span>
  {/each}
</Html>

<style>
  span {
    position: absolute;
    text-align: center;
    vertical-align: middle;
    text-wrap: balance;
  }

  .middle {
    transform: translate(-50%, -50%);
  }

  .top-left {
    transform: translate(0, 0);
  }

  .top {
    transform: translateX(-50%);
  }

  .top-right {
    transform: translateX(-100%);
  }

  .right {
    transform: translate(-100%, -50%);
  }

  .bottom-right {
    transform: translate(-100%, -100%);
  }

  .bottom {
    transform: translate(-50%, -100%);
  }

  .bottom-left {
    transform: translate(0, -100%);
  }

  .left {
    transform: translate(0, -50%);
  }

  .show-construction-marks {
    border: 1px solid black;
  }

  .show-construction-marks::after {
    content: '';
    position: absolute;
    display: block;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: red;
    left: 0;
    top: 0;
    transform: translate(-50%, -50%);
  }

  .show-construction-marks.top::after {
    left: 50%;
    top: 0;
  }
  .show-construction-marks.top-right::after {
    left: 100%;
    top: 0;
  }
  .show-construction-marks.right::after {
    left: 100%;
    top: 50%;
  }
  .show-construction-marks.bottom-right::after {
    left: 100%;
    top: 100%;
  }
  .show-construction-marks.bottom::after {
    left: 50%;
    top: 100%;
  }
  .show-construction-marks.bottom-left::after {
    left: 0%;
    top: 100%;
  }
  .show-construction-marks.left::after {
    left: 0%;
    top: 50%;
  }
</style>

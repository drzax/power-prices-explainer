<script lang="ts">
  import Label from './Label.svelte';


  import LabelConnector from './LabelConnector.svelte';

  let {
    x,
    y,
    orientation = 'right',
    variant = 'circle',
    text,
    size = 'small',
    offsetX = 0,
    offsetY = 0
  }: {
    x: number;
    y: number;
    orientation?: 'left' | 'right';
    text?: string;
    variant?: 'circle' | 'square' | 'diamond';
    size?: 'small' | 'large';
    offsetX?: number;
    offsetY?: number;
  } = $props();

  const offsetBubbleMultiplier = 1.2;

  let sideLength = $derived(size === 'small' ? 7 : 9);
  let svgSize = $derived(Math.sqrt(Math.pow(sideLength, 2) * 2));

  let labelWidth = $state(0);
  let labelHeight = $state(0);
</script>

<div class="marker" style="left: {x}px; top: {y}px;">

  {#if text}
    {#if offsetX || offsetY}
      <div class="label-connector">
        <LabelConnector
          markerPosition={{ x, y, r: (svgSize / 2) * offsetBubbleMultiplier }}
          labelPosition={{
            x: x + offsetX + (orientation === 'left' ? -labelWidth : labelWidth),
            y: y + offsetY,
            r: (labelHeight / 2) * offsetBubbleMultiplier
          }}
        />
      </div>
    {/if}
    <Label
  {/if}
</div>

<style>
  svg {
    display: block;
  }

  .mark polygon,
  .mark circle,
  .mark rect {
    fill: var(--marker-color, black);
  }

  .marker {
    position: absolute;
    transform: translate(-50%, -50%);
  }

  .label {
    position: absolute;
    top: calc(50% + var(--offset-y, 0px));
    transform: translateY(-50%);
    font-size: 0.8em;
    white-space: nowrap;
  }

  .right {
    right: unset;
    left: calc(100% + 5px + var(--offset-x, 0px));
  }

  .left {
    left: unset;
    right: calc(100% + 5px + var(--offset-x, 0px));
  }

  .label-connector {
    position: absolute;
    top: 50%;
    left: 50%;
  }
</style>

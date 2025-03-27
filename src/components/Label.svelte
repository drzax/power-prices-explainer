<script lang="ts">
  let {
    x,
    y,
    orientation = 'middle',
    text
  }: {
    x: number;
    y: number;
    orientation?: 'middle' | 'left' | 'right';
    text?: string;
    variant?: 'circle' | 'square' | 'diamond';
    size?: 'small' | 'large';
    offsetX?: number;
    offsetY?: number;
  } = $props();

  let width = $state(0);
  let height = $state(0);
</script>

<div
  class="label-position"
  style:left={x + 'px'}
  style:top={y + 'px'}
  style:--label-width={width + 'px'}
  style:--label-height={height + 'px'}
>
  <div bind:clientWidth={width} bind:clientHeight={height} class="label {orientation}">{text}</div>
</div>

<style>
  .label-position {
    position: absolute;
    width: 0px;
    height: 0px;
  }

  .label {
    position: absolute;
    top: 0.05em;
    display: block;
    transform: translate(-50%, -50%);
    white-space: nowrap;
  }

  .left {
    right: calc(1em - var(--label-width, 0px) / 2);
  }
  .right {
    left: calc(1em + var(--label-width, 0px) / 2);
  }
</style>

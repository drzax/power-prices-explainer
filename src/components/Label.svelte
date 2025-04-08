<script lang="ts">
  import { fade } from 'svelte/transition';

  let {
    x,
    y,
    offsetX,
    offsetY,
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

{#key `${text}-${x}-${y}`}
  <div
    in:fade|global={{ delay: 650 }}
    out:fade|global={{ delay: 0 }}
    class="label-position"
    style:left={x + (offsetX || 0) + 'px'}
    style:top={y + (offsetY || 0) + 'px'}
    style:--label-width={width + 'px'}
    style:--label-height={height + 'px'}
  >
    <div bind:clientWidth={width} bind:clientHeight={height} class="label {orientation}">{text}</div>
  </div>
{/key}

<style>
  .label-position {
    position: absolute;
    width: 0px;
    height: 0px;
  }

  .label {
    font-family: var(--dls-font-stack-sans);
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 100%; /* 14px */
    color: var(--highlighter-color);

    position: absolute;
    top: 0.05em;
    display: block;
    transform: translate(-50%, -50%);
    white-space: nowrap;
    text-shadow:
      -1px -1px 0 white,
      1px -1px 0 white,
      -1px 1px 0 white,
      1px 1px 0 white;
  }

  @media (min-width: 72rem) {
    :global(.label) {
      font-size: 16px !important;
    }
  }

  .left {
    right: calc(1em - var(--label-width, 0px) / 2);
  }
  .right {
    left: calc(1em + var(--label-width, 0px) / 2);
  }
</style>

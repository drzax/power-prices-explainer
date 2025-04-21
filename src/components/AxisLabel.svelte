<script>
  import { fade } from 'svelte/transition';

  let { text, x, y, vector } = $props();

  let width = $state(0);
  let height = $state(0);

  let offsetX = $derived((vector.x * (width + 12)) / 2);
  let offsetY = $derived((vector.y * (height + 12)) / 2);
  let maxWidth = $derived(text.length < 10 ? 40 : 250);

</script>

{#key text}
  <div style:top="{y}px" style:left="{x}px" class="label-segment">
    <div
      transition:fade={{ delay: 850 }}
      bind:clientWidth={width}
      bind:clientHeight={height}
      style="
          transform: translate({-offsetX}px, {-offsetY}px);
          max-width: {maxWidth}px;
      "
    >
      {text}
    </div>
  </div>
{/key}

<style>
  .label-segment {
    text-wrap: balance;
    position: absolute;
    transform: translate(-50%, -50%);
    text-align: center;
    font-family: var(--dls-font-stack-sans);
    font-size: 13px;
    font-style: normal;
    font-weight: 700;
    line-height: 120%; /* 15.6px */
    width: max(min-content, 8em);
    color: var(--label-color, #000);
  }

  @media (min-width: 72rem) {
    .label-segment {
      font-size: 16px;
    }
  }
</style>

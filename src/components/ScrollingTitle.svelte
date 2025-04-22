<script lang="ts">
  import { untrack, tick } from 'svelte';
  import { fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  let { title } = $props();

  const duration = 800;
  const easing = cubicOut;

  let previousTitle = $state('');
  let direction = $state('down');

  let titleAfterTick = $state('');
  let titleAfterTick2ndLine = $state('');

  $effect(() => {
    const pTitle = untrack(() => previousTitle);
    if (pTitle !== title) {
      direction = pTitle < title ? 'up' : 'down';
      untrack(() => { previousTitle = title; });
      tick().then(() => {
        if (title && String(title).indexOf('2025 Model') > -1) {
          const [first, second] = String(title).split(':');
          titleAfterTick = first;
          titleAfterTick2ndLine = second;
        } else {
          titleAfterTick = String(title);
          titleAfterTick2ndLine = '';
        }
      });
    }
  });

</script>

{#if titleAfterTick && titleAfterTick !== 'none'}
  {#key titleAfterTick}
    <h1
      class="title {titleAfterTick2ndLine ? 'two-lines' : ''}"
      in:fly={{ duration, easing, y: direction === 'down' ? '1em' : '-1em'}}
      out:fly={{ duration, easing, y: direction === 'down' ? '-1em' : '1em'}}
    >
      {titleAfterTick}
      <br />
      {titleAfterTick2ndLine}
    </h1>
  {/key}
{/if}

<style lang="scss">
  .title {
    font-family: var(--dls-font-stack-sans);
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 100%; /* 20px */
    position: absolute;
    top: 20%;
    left: 10%;
  }

  @media (max-width: 61rem) {
    :global(.title.two-lines) {
      font-size: 16px !important;
      line-height: 120% !important;
      text-align: center;
    }
  }

  @media (min-width: 62rem) {
    .title {
      font-size: 32px;
    }

    :global(.title.two-lines) {
      font-size: 28px !important;
      line-height: 120% !important;
      text-align: center;
    }
  }
</style>

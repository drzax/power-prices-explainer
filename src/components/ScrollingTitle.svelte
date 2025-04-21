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
  $effect(() => {
    const pTitle = untrack(() => previousTitle);
    if (pTitle !== title) {
      direction = pTitle < title ? 'up' : 'down';
      untrack(() => { previousTitle = title; });
      tick().then(() => {
        titleAfterTick = title;
      });
    }
  });

</script>

{#if titleAfterTick && titleAfterTick !== 'none'}
  {#key titleAfterTick}
    <h1
      class="title"
      in:fly={{ duration, easing, y: direction === 'down' ? '1em' : '-1em'}}
      out:fly={{ duration, easing, y: direction === 'down' ? '-1em' : '1em'}}
    >
      {titleAfterTick}
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

  @media (min-width: 62rem) {
    .title {
      font-size: 32px;
    }
  }
</style>

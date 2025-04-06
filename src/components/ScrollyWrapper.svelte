<script lang="ts">
  import { onMount } from 'svelte';
  import Scrollyteller from '@abcnews/svelte-scrollyteller';
  import Visualisation from './Visualisation.svelte';
  import { visState } from '../lib/state.svelte';
  import { decode } from '@abcnews/base-36-props';

  const updateState = detail => {
    try {
      visState.config = decode(detail.config);
    } catch (e) {
      console.error(e, detail);
    }
  };

  onMount(() => {
    Array.from(document.querySelectorAll('strong'))
      .filter(p => p.innerText.toString() === 'Coalition')
      .forEach(p => {
        p.classList.add('party-label');
        p.classList.add('label-lnp');
      });

    Array.from(document.querySelectorAll('strong'))
      .filter(p => p.innerText.toString() === 'Labor')
      .forEach(p => {
        p.classList.add('party-label');
        p.classList.add('label-alp');
      });

    Array.from(document.querySelectorAll('strong'))
      .filter(p => p.innerText.toString() === 'Other' || p.innerText.toString() === 'Independent')
      .forEach(p => {
        p.classList.add('party-label');
        p.classList.add('label-oth');
      });
  });

  let { panels } = $props();
</script>

<Scrollyteller {panels} onMarker={updateState} layout={{ align: 'left', resizeInteractive: true }}>
  <Visualisation />
</Scrollyteller>

<style>

  :global(.party-label) {
    --pty-color-alp: #e11f30;
    --pty-color-lnp: #0a52bf;
    --pty-color-oth: #757575;
  }

  :global(.label-lnp) {
    color: var(--pty-color-lnp);
  }
  :global(.label-alp) {
    color: var(--pty-color-alp);
  }
  :global(.label-oth) {
    color: var(--pty-color-oth);
  }

</style>

<script lang="ts">
  import { mount } from 'svelte';
  import { data } from '../lib/data.svelte';
  import Scrollyteller from '@abcnews/svelte-scrollyteller';
  import Visualisation from './Visualisation.svelte';
  import Mark from './primatives/Mark.svg.svelte';
  import { loadMarkerConfig } from '../lib/data-accessors';

  let latestConfig: string = '';

  const updateState = (detail: { config: string }) => {
    if (latestConfig !== detail.config) {
      try {
        loadMarkerConfig(detail.config);
        latestConfig = detail.config;
      } catch (e) {
        console.error(e, detail);
      }
    }
  };

  //
  // Find any bolded electorate names in the panel copy, and enhance them visually
  //
  let { panels } = $props();
</script>

<Scrollyteller
  {panels}
  onMarker={updateState}
  layout={{ align: 'left', mobileVariant: 'rows', resizeInteractive: true }}
>
  <Visualisation />
</Scrollyteller>

<style>
  @media (max-width: 62rem) {
    :global(.viz) {
      transform: translateY(-20px) !important;
      max-height: calc(42dvh + 50px) !important;
    }
  }
</style>

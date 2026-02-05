<script lang="ts">
  import Scrollyteller from '@abcnews/svelte-scrollyteller';
  import Visualisation from './Visualisation.svelte';

  import { loadMarkerConfig } from '../lib/data-accessors';
  import configs from '../data/configs.json';

  let latestConfig: string = '';

  const updateState = (detail: { config: string }) => {
    const config = detail.config ? detail.config : configs[detail.view];

    if (latestConfig !== config) {
      try {
        loadMarkerConfig(config);
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
  :global(body) {
    overflow: initial !important;
  }
</style>

<script lang="ts">
  import { Tabs, Tab, TabContent } from 'carbon-components-svelte';
  import { encode } from '@abcnews/base-36-props';

  import MarkersTab from './MarkersTab.svelte';
  import PropertiesTab from './PropertiesTab.svelte';
  import Visualisation from '../Visualisation.svelte';
  import 'carbon-components-svelte/css/white.css';
  import { visState } from '../../lib/state.svelte';
  import { onMount } from 'svelte';
  import UpdateChecker from './UpdateChecker.svelte';
  import BuilderStyleRoot from './BuilderStyleRoot.svelte';
  import { loadMarkerConfig } from '../../lib/data-accessors';

  onMount(() => {
    try {
      const urlConfig = document.location.hash.substring(1);
      if (urlConfig) {
        loadMarkerConfig(urlConfig);
      }
    } catch (e) {
      console.error(e);
    }
  });

  // import { graphToUrlQuery, urlQueryToPartialGraph } from '../../lib/encode';

  $effect(() => {
    const url = new URL(document.location.href);
    url.hash = encode(visState.config);
    history.replaceState(undefined, document.title, url.toString());
  });
</script>

<BuilderStyleRoot>
  <UpdateChecker /></BuilderStyleRoot
>
<main>
  <article>
    <figure>
      <Visualisation />
    </figure>
  </article>
  <aside>
    <Tabs autoWidth>
      <Tab label="Properties" />
      <Tab label="Markers" />
      <svelte:fragment slot="content">
        <TabContent><PropertiesTab /></TabContent>
        <TabContent><MarkersTab /></TabContent>
      </svelte:fragment>
    </Tabs>
  </aside>
</main>

<style>
  main {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: stretch;
    min-height: 100vh;
  }

  article {
    flex: 0 0 auto;
    margin: auto;
    width: 100%;
    height: 100vh;
    max-width: 52rem;
    padding: 3rem;
  }

  figure {
    margin: auto;
    width: 100%;
    height: 100%;
  }

  aside {
    flex: 1 1 100%;
    border-top: 2px solid #e0e0e0;
    width: 100%;
  }

  @media (min-width: 72rem) {
    aside {
      align-self: stretch;
      margin: 0;
      border-top: 0;
      border-left: 2px solid #e0e0e0;
      max-width: 32rem;
      max-height: 100vh;
      overflow-x: hidden;
      overflow-y: scroll;
    }
  }

  aside :global(.bx--tabs) {
    position: relative;
  }

  aside :global(.bx--tabs)::before {
    content: '';
    z-index: 0;
    position: absolute;
    top: calc(2.5rem - 2px);
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #e0e0e0;
  }

  aside :global(.bx--accordion) {
    margin: -1rem;
    width: calc(100% + 2rem);
  }

  aside :global(.bx--accordion__item):first-child {
    border-top: 0;
  }

  aside :global(.bx--accordion__content) {
    padding-right: 1rem !important;
  }

  :global(h1:not(:first-child), h2, h3:not(:first-child), h4:not(:first-child), p:not(:first-child)) {
    margin-top: 0.5em;
  }
  :global(h1:not(:last-child), h2, h3:not(:last-child), h4:not(:last-child), p:not(:last-child)) {
    margin-bottom: 0.5em;
  }
</style>

<script lang="ts">
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

  let { panels } = $props();
</script>

<Scrollyteller {panels} onMarker={updateState} layout={{ align: 'left', resizeInteractive: true }}>
  <Visualisation />
</Scrollyteller>

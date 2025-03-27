<svelte:options namespace="svg" />

<script lang="ts">
  import type { ResultType } from '../lib/data';
  import { plot, scale } from '../lib/state.svelte';
  import Mark from './Mark.svg.svelte';

  let { data }: { data: ResultType } = $props();

  let unscaled = $derived(scale([data.OTH, data.ALP, data.LNP]));
  let radius = $derived(Math.min(plot.width, plot.height) / 2 - 5);
  let variant: 'square' | 'circle' | 'diamond' = $derived(
    data.PartyAb === 'LNP' ? 'square' : data.PartyAb === 'OTH' ? 'diamond' : 'circle'
  );
  let x = $derived(unscaled[0] * radius + plot.width / 2);
  let y = $derived(unscaled[1] * radius + plot.height / 2);
</script>

<Mark --marker-color="var(--pty-color-{data.PartyAb.toLowerCase()})" {x} {y} {variant} />

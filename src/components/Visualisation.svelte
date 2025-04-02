<script lang="ts">
  import Plot from './Plot.svelte';
  import Svg from './Svg.svelte';
  import Result from './Result.svg.svelte';
  import { visualisationConfiguration } from '../lib/state.svelte';
  import { parties } from '../lib/constants';
  import { data } from '../lib/data';

  // Filter data based on vis configuration
  let filteredData = $derived.by(() => {
    return data.filter(d => {
      const { yearFilters, electorateFilters, partyFilters } = visualisationConfiguration;
      return (
        (yearFilters.length === 0 || yearFilters.includes(d.Year)) &&
        (electorateFilters.length === 0 || electorateFilters.includes(d.DivisionNm)) &&
        (partyFilters.length === 0 || partyFilters.includes(d.PartyAb))
      );
    });
  });
</script>

<div>
  <Plot displayCentralZone={visualisationConfiguration.displayCentralZone} segments={parties}>
    <Svg>
      {#each filteredData as data}<Result {data} />{/each}
    </Svg>
    <Svg --marker-outline-color="white">
      <Result data={{ ALP: 0, LNP: 0, OTH: 100, DivisionNm: '', PartyAb: 'OTH', Year: 0 }} />
      <Result data={{ ALP: 100, LNP: 0, OTH: 0, DivisionNm: '', PartyAb: 'ALP', Year: 0 }} />
      <Result data={{ ALP: 0, LNP: 100, OTH: 0, DivisionNm: '', PartyAb: 'LNP', Year: 0 }} />
    </Svg>
  </Plot>
</div>

<style lang="scss">
  div {
    --pty-color-alp: #e11f30;
    --pty-color-lnp: #0a52bf;
    --pty-color-oth: #757575;
  }
</style>

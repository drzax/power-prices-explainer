<script lang="ts">
  import Plot from './Plot.svelte';

  import { barycentric } from 'd3-ternary';
  import Svg from './Svg.svelte';
  import Mark from './Mark.svg.svelte';

  import { translate } from '../lib/trig';
  import { plot, scale } from '../lib/state.svelte';
  import Result from './Result.svg.svelte';
  const middle = $derived({ x: plot.width / 2, y: plot.height / 2 });
  const markerPosition = $derived.by(
    () => (point: [number, number]) => translate({ x: point[0], y: point[1] }, middle)
  );

  // TODO: filter data appropriately here based on selections

  // TODO: setup plot configuration here
</script>

<div>
  <Plot>
    <Svg>
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

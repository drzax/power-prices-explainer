<script lang="ts">
  import { data } from '../lib/data.svelte';
  import { visState } from '../lib/state.svelte';

  import { LayerCake, Svg, Html, groupLonger, flatten } from 'layercake';

  import { scaleOrdinal } from 'd3-scale';
  import { timeParse, timeFormat } from 'd3-time-format';
  import { format } from 'd3-format';
  import AxisX from './layercake-components/AxisX.svg.svelte';
  import AxisY from './layercake-components/AxisY.svg.svelte';
  import Line from './layercake-components/Line.svg.svelte';
  import { plotMargins } from '../lib/constants';
  import Annotations from './layercake-components/Annotations.svelte';
  import Arrows from './layercake-components/Arrows.svelte';
  import Highlight from './layercake-components/Highlight.svelte';

  const xKey = 'date';
  const yKey = 'value';
  const zKey = 'series';

  const seriesColors = ['#007BC7', '#00297E'];

  const seriesNames = Object.keys(data[0]).filter(d => d !== xKey);

  const groupedData = $derived(
    groupLonger(data, seriesNames, {
      groupTo: zKey,
      valueTo: yKey
    })
  );

  const formatLabelX = timeFormat('%b. %Y');
  const formatLabelY = (d: number) => format(`~s`)(d);
  let chartWidth: number = $state(0);
  let { showConstructionMarks = false } = $props();
</script>

<div bind:clientWidth={chartWidth}>
  <h2 class="chart-title">{visState.config.title}</h2>
  <LayerCake
    padding={plotMargins}
    x={xKey}
    y={yKey}
    z={zKey}
    zScale={scaleOrdinal()}
    zRange={seriesColors}
    flatData={flatten(groupedData, 'values')}
    data={groupedData}
    custom={{ showConstructionMarks }}
  >
    <Svg>
      <AxisX gridlines={false} ticks={Math.floor(chartWidth / 130)} format={formatLabelX} tickMarks />
      <AxisY ticks={4} format={formatLabelY} />
      <Line />
    </Svg>
    <Highlight />
    <Annotations />
    <Arrows />
  </LayerCake>
</div>

<style lang="scss">
  div {
    width: 100%;
    height: 100%;
    padding-left: 30px;
    padding-right: 30px;
    display: flex;
    flex-direction: column;
  }
  h2 {
    margin-bottom: 0;
  }
</style>

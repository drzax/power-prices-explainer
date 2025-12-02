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
</script>

<div>
  <LayerCake
    padding={plotMargins}
    x={xKey}
    y={yKey}
    z={zKey}
    zScale={scaleOrdinal()}
    zRange={seriesColors}
    flatData={flatten(groupedData, 'values')}
    data={groupedData}
  >
    <h2 class="chart-title">{visState.config.title}</h2>
    <Svg>
      <AxisX gridlines={false} ticks={5} format={formatLabelX} snapLabels tickMarks />
      <AxisY ticks={4} format={formatLabelY} />
      <Line />
    </Svg>
    <Annotations />
    <Arrows />
  </LayerCake>
</div>

<style lang="scss">
  div {
    width: 100%;
    height: 100%;
  }
</style>

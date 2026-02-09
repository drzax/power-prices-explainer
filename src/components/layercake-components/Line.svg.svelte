<!--
  @component
  Generates an SVG multi-series line chart. It expects your data to be an array of objects, each with a `values` key that is an array of data objects.
 -->
<script>
  import { getContext } from 'svelte';
  import { line, curveLinear } from 'd3-shape';
  import { visState } from '../../lib/state.svelte';

  const { data, xGet, yGet, zGet } = getContext('LayerCake');

  /** @typedef {import('d3-shape').CurveFactory} CurveFactory */
  /**
   * @typedef {Object} Props
   * @property {CurveFactory} [curve] - An optional D3 interpolation function. See [d3-shape](https://github.com/d3/d3-shape#curves) for options. Pass this function in uncalled, i.e. without the open-close parentheses.
   */

  const getSeries = name => {
    return $data.find(d => d.series === name);
  };

  /** @type {Props} */
  let { curve = curveLinear } = $props();

  let path = $derived(line().x($xGet).y($yGet).curve(curve));
  $effect(() => {
    console.log('visState.config.lines :>> ', visState.config.lines);
  });
</script>

<g class="line-group">
  {#each visState.config.lines as line}
    {#if !line.deleted}
      <path
        key={line.id}
        class="path-line"
        d={path(getSeries(line.series).values)}
        stroke={$zGet(getSeries(line.series))}
      ></path>
    {/if}
  {/each}
</g>

<style>
  .path-line {
    fill: none;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 3px;
    transition: d 0.5s ease;
  }
</style>

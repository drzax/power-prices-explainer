<script lang="ts">
  import { ternaryToCartesian, visState } from '../lib/state.svelte';
  import { electorateSynonyms, parties } from '../lib/constants';
  import { data } from '../lib/data.svelte';

  import Plot from './Plot.svelte';
  import Svg from './Svg.svelte';
  import Result from './Result.svg.svelte';
  import Mark from './Mark.svg.svelte';
  import Html from './Html.svelte';
  import Label from './Label.svelte';
  import ScrollingTitle from './ScrollingTitle.svelte';
  import { getSegmentsFromParties, getTernaryCoordinatesFromResult } from '../lib/data-accessors';
  import Arrow from './Arrow.svg.svelte';
  import { groups } from 'd3-array';
  import ArrowLink from './ArrowLink.svg.svelte';

  let innerWidth = $state(0);

  let filteredData = $derived.by(() => {
    const { year, electorate, party } = visState.config.filters;
    if (year.length === 0 && electorate.length === 0 && party.length === 0) {
      return [];
    }
    const filtered = data.results
      ?.filter(d => !!d)
      .filter(d => {
        return (
          electorate.length === 0 ||
          electorate.includes(d.DivisionNm) ||
          electorate.includes(electorateSynonyms[d.DivisionNm])
        );
      })
      .filter(d => year.length === 0 || year.includes(d.Year))
      .filter(d => party.length === 0 || party.includes(d.PartyAb));

    return filtered;
  });

  let title = $derived(visState.config.title || '');
  let resultKey = $derived.by(() => {
    const { year, electorate } = visState.config.filters;
    if (electorate.length > 0 && year.length === 0) {
      return 'Year';
    }
    if (year.length > 0 && electorate.length === 0) {
      return 'DivisionNm';
    }
    return 'id';
  });
  let groupedByDivision = $derived(
    filteredData && groups(filteredData, d => electorateSynonyms[d.DivisionNm] || d.DivisionNm)
  );
</script>

<svelte:window bind:innerWidth />

<div>
  {#if data.results}
    <Plot
      displayCentralZone={visState.config.displayCentralZone}
      displayAxes={visState.config.displayAxes}
      displayOutline={visState.config.displayTernaryOutline}
      displaySegments={visState.config.displaySegments}
      segments={getSegmentsFromParties()}
    >
      <Html>
        <ScrollingTitle {title} />
      </Html>

      {#if groupedByDivision}
        <Svg>
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 14 14"
              refX="6"
              refY="7"
              markerWidth="8"
              markerHeight="14"
              orient="auto-start-reverse"
            >
              <path
                d="M1 1 L7 7 L1 13"
                stroke="black"
                fill="none"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </marker>
          </defs>
          {#each groupedByDivision.filter( ([d]) => visState.config.timeArrows?.includes(d) ) as [division, group] (division)}
            {#if group.length > 1}
              <ArrowLink results={group} />
            {/if}
          {/each}
        </Svg>
      {/if}
      {#if filteredData}
        <Svg>
          {#each filteredData as data (data[resultKey])}
            <Result size={'sm'} {data} />
          {/each}
        </Svg>
      {/if}
      <Svg --marker-outline-color="white">
        {#each visState.config.marks as mark (JSON.stringify(mark.location))}
          <Mark
            size="md"
            --marker-color="var(--pty-color-{mark.party.toLowerCase()})"
            {...ternaryToCartesian(mark.location)}
            variant={parties.get(mark.party.toLowerCase())?.shape}
          />
        {/each}

        <defs>
          <linearGradient id="arrow-gradient">
            <stop offset="60%" stop-color="rgb(255, 255, 255, 1)" />
            <stop offset="100%" stop-color="rgb(255, 255, 255, 0)" />
          </linearGradient>
        </defs>

        {#each visState.config.arrows as arrow}
          <Arrow
            --arrow-fill-color="url(#arrow-gradient)"
            from={ternaryToCartesian(arrow.from)}
            to={ternaryToCartesian(arrow.to)}
            lineWidth={2}
          />
        {/each}

        {#each visState.config.highlights as highlight (highlight)}
          {@const result = data.results.find(d => d.DivisionNm === highlight.electorate && d.Year === highlight.year)}
          {#if result}
            <Result size={'md'} data={result} opacity={1} />
          {/if}
        {/each}
      </Svg>
      <Html>
        {#each visState.config.highlights as highlight (highlight)}
          {@const result = data.results.find(d => d.DivisionNm === highlight.electorate && d.Year === highlight.year)}
          {#if result}
            <Label
              --highlighter-color="var(--pty-color-{result.PartyAb.toLocaleLowerCase()})"
              {...ternaryToCartesian(getTernaryCoordinatesFromResult(result))}
              text="{highlight.label.name ? result.DivisionNm : ''} {highlight.label.year ? result.Year : ''}"
              orientation={highlight.label.orientation}
            >
              {#snippet content()}
                {#if highlight.label.name}
                  <span class="electorate-label-plot">
                    {result.DivisionNm}
                  </span>
                {/if}
                {#if highlight.label.year}
                  <span class="electorate-label-plot {highlight.label.name ? 'small' : ''}">
                    {result.Year}
                  </span>
                {/if}
              {/snippet}
            </Label>
          {/if}
        {/each}
        {#each visState.config.marks as mark}
          {#if mark.label && mark.label.length}
            <Label
              --marker-color="var(--pty-color-{mark.party.toLowerCase()})"
              {...ternaryToCartesian(mark.location)}
              text={mark.label}
              orientation={mark.orientation}
            />
          {/if}
        {/each}
      </Html>
    </Plot>
  {/if}
</div>

<style lang="scss">
  div {
    width: 100%;
    height: 100%;
    --pty-color-alp: #e11f30;
    --pty-color-lnp: #0a52bf;
    --pty-color-oth: #757575;
    --pty-color-blk: #000000;
    --pty-color-tooclose: #aaaaaa;

    --pty-color-text-alp: #e11f30;
    --pty-color-text-lnp: #0a52bf;
    --pty-color-text-oth: #595959;
    --pty-color-text-blk: #000000;
  }

  .electorate-label-plot.small {
    font-size: 0.875em;
    display: block;
  }
</style>

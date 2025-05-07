<script lang="ts">
  import { ternaryToCartesian, visState } from '../lib/state.svelte';
  import { parties } from '../lib/constants';
  import { data, electorates } from '../lib/data.svelte';
  import { DESKTOP_BREAKPOINT } from '../lib/constants';

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

  $effect(() => {
    console.log('data.results :>> ', data.results);
  });

  let filteredData = $derived.by(() => {
    const { year, electorate, party, pollsters } = visState.config.filters;

    // Use alternate dataset if in 'national polls' mode
    if (visState.config.nationalPolls) {
      return data.nationalPolls2025;
    }

    if (visState.config.mrpPolls) {
      return electorates.map(e => data.polls.find(d => d.DivisionNm === e && d.Year === pollsters[0])).filter(d => !!d);
    }

    // const filtered = data.filter(d => !!d).filter(d => electorate.length === 0 || electorate.includes(d.DivisionNm));

    const filtered = data.results
      ?.filter(d => !!d)
      .filter(d => electorate.length === 0 || electorate.includes(d.DivisionNm))
      .filter(d => year.length === 0 || year.includes(d.Year))
      .filter(d => party.length === 0 || party.includes(d.PartyAb));

    return filtered;
  });

  let defaultTitle = $derived(
    visState.config.mrpPolls
      ? visState.config.filters.pollsters[0]
      : visState.config.filters.year[0]
        ? visState.config.filters.year[0]
        : ''
  );
  let title = $derived(visState.config.title || defaultTitle);

  let groupedByDivision = $derived(groups(filteredData, d => d.DivisionNm));
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
        {#each groupedByDivision.filter( ([d]) => visState.config.timeArrows.includes(d) ) as [division, group] (division)}
          {#if group.length > 1}
            <ArrowLink results={group} />
          {/if}
        {/each}
      </Svg>

      <Svg>
        {#each filteredData as data (data.id)}
          <Result size={'sm'} {data} />
        {/each}
      </Svg>

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
          {@const labelOffsetMagnitude =
            highlight.label.orientation === 'middle' ? 0 : innerWidth > DESKTOP_BREAKPOINT ? 18 : 15}
          {@const labelOffset =
            highlight.label.orientation === 'right' || highlight.label.orientation === 'below'
              ? labelOffsetMagnitude
              : -labelOffsetMagnitude}
          {#if result}
            <Label
              --highlighter-color="var(--pty-color-{result.PartyAb.toLocaleLowerCase()})"
              {...ternaryToCartesian(getTernaryCoordinatesFromResult(result))}
              offsetY={highlight.label.orientation === 'middle' ? labelOffset : -3}
              text="{highlight.label.name ? result.DivisionNm : ''} {highlight.label.year ? result.Year : ''}"
              orientation={highlight.label.orientation}
            />
          {/if}
        {/each}
        {#each visState.config.marks as mark}
          {@const labelOffsetMagnitude = mark.orientation === 'middle' ? 0 : innerWidth > DESKTOP_BREAKPOINT ? 18 : 15}
          {@const labelOffset =
            mark.orientation === 'right' || mark.orientation === 'below' ? labelOffsetMagnitude : -labelOffsetMagnitude}
          {#if mark.label && mark.label.length}
            <Label
              --marker-color="var(--pty-color-{mark.party.toLowerCase()})"
              {...ternaryToCartesian(mark.location)}
              offsetY={labelOffset}
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
</style>

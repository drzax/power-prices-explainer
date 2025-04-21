<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { ternaryToCartesian, visState } from '../lib/state.svelte';
  import { parties } from '../lib/constants';
  import { data, polls, electorates, nationalPolls2025 } from '../lib/data';
  import { DESKTOP_BREAKPOINT } from '../lib/constants';

  import Plot from './Plot.svelte';
  import Svg from './Svg.svelte';
  import Result from './Result.svg.svelte';
  import Mark from './Mark.svg.svelte';
  import Html from './Html.svelte';
  import Label from './Label.svelte';
  import { getSegmentsFromParties, getTernaryCoordinatesFromResult } from '../lib/data-accessors';
  import Arrow from './Arrow.svg.svelte';
  import LabelConnector from './LabelConnector.svelte';

  // Filter data based on vis configuration
  // let filteredData = $derived.by(() => {
  //   return data.filter(d => {
  //     const {
  //       filters: { year, electorate, party }
  //     } = visState.config;
  //     return (
  //       year.includes(d.Year) &&
  //       (electorate.length === 0 || electorate.includes(d.DivisionNm)) &&
  //       (party.length === 0 || party.includes(d.PartyAb))
  //     );
  //   }).sort((a, b) => a.DivisionNm.localeCompare(b.DivisionNm))
  // });

  let innerWidth = $state(0);

  let filteredData = $derived.by(() => {
    const { year, electorate, party, pollsters } = visState.config.filters;
    const activeYear = year[0] || 2022;

    // Use alternate dataset if in 'national polls' mode
    if (visState.config.nationalPolls) {
      return nationalPolls2025;
    }

    if (visState.config.mrpPolls) {
      return electorates.map(e =>
        polls.find(d => d.DivisionNm === e && d.Year === pollsters[0])
      )
        .filter(d => !!d);
    }

    return electorates.map(e =>
       data.find(d => d.DivisionNm === e && d.Year === activeYear)
    )
      .filter(d => !!d)
      .filter(d => electorate.length === 0 || electorate.includes(d.DivisionNm));
  });

  let singleYear = $derived(visState.config.filters.year.length === 1 && visState.config.filters.year[0] !== 'none');
  let defaultTitle = $derived(visState.config.mrpPolls ? visState.config.filters.pollsters[0] : visState.config.filters.year[0]);
  let title = $derived(visState.config.title || defaultTitle);

  const TITLE_ANIMATION_DUR = 850;
  let previousTitle = $state('');
  let direction = $state('down');
  $effect(() => {
    if (previousTitle !== title) {
      direction = previousTitle > title ? 'down' : 'up';
      previousTitle = title;
    }
  });

  let labelOffset = $derived(innerWidth > DESKTOP_BREAKPOINT ? -18 : -15);
</script>

<svelte:window bind:innerWidth />

<div>
  <Plot
    displayCentralZone={visState.config.displayCentralZone}
    displayAxes={visState.config.displayAxes}
    displayOutline={visState.config.displayTernaryOutline}
    displaySegments={visState.config.displaySegments}
    segments={getSegmentsFromParties()}
  >
    <Html>
      {#if title && title !== 'none'}
        {#key title}
          <h1
            class="title"
            in:fly={{ duration: TITLE_ANIMATION_DUR, y: direction === 'up' ? '1em' : '-1em'}}
            out:fly={{ duration: TITLE_ANIMATION_DUR, y: direction === 'up' ? '-1em' : '1em'}}
          >
            {title}
          </h1>
        {/key}
      {/if}
    </Html>


    <Svg>
      {#each filteredData as data (data.DivisionNm)}
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
        />
      {/each}

      {#each visState.config.highlights as highlight}
        {@const result = data.find(d => d.DivisionNm === highlight.electorate && d.Year === highlight.year)}
        {#if result}
          <Result size={'md'} data={result} />
        {/if}
      {/each}
      {#each visState.config.annotations as annotation, i (annotation)}
        <LabelConnector
          markerPosition={{ ...ternaryToCartesian(annotation.markLocation), r: annotation.radius }}
          labelPosition={{ ...ternaryToCartesian(annotation.textLocation), r: 20 }}
        />
      {/each}
    </Svg>
    <Html>
      {#each visState.config.highlights as highlight (highlight.electorate)}
        {@const result = data.find(d => d.DivisionNm === highlight.electorate && d.Year === highlight.year)}
        <Label
          --highlighter-color="var(--pty-color-{result.PartyAb.toLocaleLowerCase()})"
          {...ternaryToCartesian(getTernaryCoordinatesFromResult(result))}
          offsetY={labelOffset}
          text="{highlight.label.name ? result.DivisionNm : ''} {highlight.label.year ? result.Year : ''}"
          orientation={highlight.label.orientation}
        />
      {/each}
      {#each visState.config.marks as mark}
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
      {#each visState.config.annotations as annotation, i (annotation)}
        {#if annotation.text && annotation.text.length}
          <Label
            {...ternaryToCartesian(annotation.textLocation)}
            text={annotation.text}
            orientation={annotation.orientation}
          />
        {/if}
      {/each}
    </Html>
  </Plot>
</div>

<style lang="scss">
  .title {
    font-family: var(--dls-font-stack-sans);
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 100%; /* 20px */
    position: absolute;
    top: 20%;
    left: 10%;
  }

  @media (min-width: 62rem) {
    .title {
      font-size: 32px;
    }
  }


  div {
    width: 100%;
    height: 100%;
    --pty-color-alp: #e11f30;
    --pty-color-lnp: #0a52bf;
    --pty-color-oth: #757575;
    --pty-color-blk: #000000;
    --pty-color-text-alp: #e11f30;
    --pty-color-text-lnp: #0a52bf;
    --pty-color-text-oth: #595959;
    --pty-color-text-blk: #000000;
  }
</style>

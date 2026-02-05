<script lang="ts">
  import { encode } from '@abcnews/base-36-props';
  import { BuilderStyleRoot, BuilderFrame, ScreenshotTool, MarkerAdmin } from '@abcnews/components-builder';
  import Visualisation from '../Visualisation.svelte';
  import { visState } from '../../lib/state.svelte';
  import { onMount } from 'svelte';
  import { loadMarkerConfig } from '../../lib/data-accessors';
  import { isValiError } from 'valibot';
  import {
    AnnotationAnchorType,
    type AnnotationType,
    type ArrowType,
    type HighlightType,
    type SeriesType
  } from '../../lib/types';
  import { PROJECT_NAME, SCROLLY_MARK_PREFIX, SCROLLY_OPENER_PREFIX } from '../../lib/constants';
  import AnchorPointSelector from './AnchorPointSelector.svelte';

  const loadConfigFromUrl = () => {
    try {
      const urlConfig = document.location.hash
        .substring(1)
        .replace(SCROLLY_OPENER_PREFIX.substring(1), '')
        .replace(SCROLLY_MARK_PREFIX.substring(1), '');
      if (urlConfig) {
        loadMarkerConfig(urlConfig);
      }
    } catch (e) {
      console.error(e);
      console.error(isValiError(e));
    }
  };

  onMount(() => {
    loadConfigFromUrl();

    window.addEventListener('hashchange', loadConfigFromUrl);
    return () => {
      window.removeEventListener('hashchange', loadConfigFromUrl);
    };
  });

  const defaultAnnotation = { label: '', x: '', y: 0, anchor: AnnotationAnchorType.TopLeft, width: 10 };
  const defaultArrow = { from: { x: '', y: 0 }, to: { x: '', y: 0 } };
  const defaultHighlight = { tl: { x: '2019-01-01', y: 10 }, br: { x: '2020-01-01', y: 100 } };
  const defaultLine = { id: '', series: 'excl' };

  let currentAnnotation: AnnotationType | undefined = $state();
  let currentArrow: ArrowType | undefined = $state();
  let currentHighlight: HighlightType | undefined = $state();
  let currentLine: SeriesType | undefined = $state();
  let showConstructionMarks: boolean = $state(localStorage.getItem('showConstructionMarks') !== null);

  $effect(() => {
    if (showConstructionMarks) {
      localStorage.setItem('showConstructionMarks', 'true');
    } else {
      localStorage.removeItem('showConstructionMarks');
    }
  });

  const currentAnnotationExists = $derived(
    currentAnnotation && visState.config.annotations.includes(currentAnnotation)
  );
  const currentArrowExists = $derived(currentArrow && visState.config.arrows.includes(currentArrow));
  const currentHighlightExists = $derived(currentHighlight && visState.config.highlights.includes(currentHighlight));
  const currentLineExists = $derived(currentLine && visState.config.lines.includes(currentLine));

  const saveAnnotation = () => {
    if (!currentAnnotationExists && currentAnnotation) {
      visState.config.annotations.push(currentAnnotation);
    }
    currentAnnotation = undefined;
  };
  const saveLine = () => {
    if (!currentLineExists && currentLine) {
      visState.config.lines.push(currentLine);
    }
    currentLine = undefined;
  };
  const saveArrow = () => {
    if (!currentArrowExists && currentArrow) {
      visState.config.arrows.push(currentArrow);
    }
    currentArrow = undefined;
  };
  const saveHighlight = () => {
    if (!currentHighlightExists && currentHighlight) {
      visState.config.highlights.push(currentHighlight);
    }
    currentHighlight = undefined;
  };

  $effect(() => {
    const url = new URL(document.location.href);

    url.hash = encode(visState.config);
    history.replaceState(undefined, document.title, url.toString());
  });
</script>

{#snippet Viz()}
  <Visualisation {showConstructionMarks} />
{/snippet}

{#snippet Sidebar()}
  <fieldset>
    <legend>Chart options</legend>
    <label class="item" for="chart-title">Title</label>
    <input id="chart-title" type="text" bind:value={visState.config.title} />
  </fieldset>
  <fieldset>
    <legend>Lines</legend>
    {#if currentLine}
      <label for="line-id">ID</label>
      <input id="line-id" type="text" bind:value={currentLine.id} />
      <label for="line-series">Series</label>
      <select bind:value={currentLine.series}>
        <option value="excl">Excluding subsidies</option>
        <option value="incl">Including subsidies</option>
      </select>
      {#if !currentLineExists}
        <button onclick={() => (currentLine = undefined)}>Cancel</button>
      {/if}
      <button onclick={saveLine}
        >{#if currentLineExists}Done{:else}Save{/if}</button
      >
    {:else}
      <button onclick={() => (currentLine = { ...defaultLine })}>New line</button>
    {/if}
    {#if visState.config.lines.length > 0}
      <table>
        <tbody>
          {#each visState.config.lines as line}
            <tr>
              <td>{line.id}</td>
              <td class="button"><button onclick={() => (currentLine = line)}>Edit</button></td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </fieldset>
  <fieldset>
    <legend>Annotations</legend>
    {#if currentAnnotation}
      <label for="annotation-text">Label</label>
      <input id="annotation-text" type="text" bind:value={currentAnnotation.label} />
      <label for="x-position">x</label>
      <input id="x-position" type="date" bind:value={currentAnnotation.x} />
      <label for="y-position">y</label>
      <input id="y-position" type="number" bind:value={currentAnnotation.y} />
      <span>Anchor position</span>
      <AnchorPointSelector bind:value={currentAnnotation.anchor} />
      <label for="label-width">Width</label>
      <input id="label-width" type="number" min="5" max="100" bind:value={currentAnnotation.width} />em
      {#if !currentAnnotationExists}
        <button onclick={() => (currentAnnotation = undefined)}>Cancel</button>
      {/if}
      <button onclick={saveAnnotation}
        >{#if currentAnnotationExists}Done{:else}Save{/if}</button
      >
    {:else}
      <button onclick={() => (currentAnnotation = { ...defaultAnnotation })}>New annotation</button>
    {/if}
    {#if visState.config.annotations.length > 0}
      <table>
        <tbody>
          {#each visState.config.annotations as annotation}
            <tr>
              <td>{annotation.label}</td>
              <td class="button"><button onclick={() => (currentAnnotation = annotation)}>Edit</button></td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </fieldset>
  <fieldset>
    <legend>Arrows</legend>
    {#if currentArrow}
      <label for="annotation-text">from x</label>
      <input type="date" bind:value={currentArrow.from.x} />
      <label for="annotation-text">from y</label>
      <input type="number" bind:value={currentArrow.from.y} />
      <label for="annotation-text">to x</label>
      <input type="date" bind:value={currentArrow.to.x} />
      <label for="annotation-text">to y</label>
      <input type="number" bind:value={currentArrow.to.y} />
      {#if !currentArrowExists}
        <button onclick={() => (currentArrow = undefined)}>Cancel</button>
      {/if}
      <button onclick={saveArrow}
        >{#if currentArrowExists}Done{:else}Save{/if}</button
      >
    {:else}
      <button onclick={() => (currentArrow = { ...defaultArrow })}>New arrow</button>
    {/if}
    {#if visState.config.arrows.length > 0}
      <table>
        <tbody>
          {#each visState.config.arrows as arrow}
            <tr>
              <td>{Object.values(arrow.from).join(', ')} → {Object.values(arrow.to).join(', ')}</td>
              <td class="button"><button onclick={() => (currentArrow = arrow)}>Edit</button></td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </fieldset>
  <fieldset>
    <legend>Highlights</legend>
    {#if currentHighlight}
      <label for="annotation-text">from x</label>
      <input type="date" bind:value={currentHighlight.tl.x} />
      <label for="annotation-text">from y</label>
      <input type="number" bind:value={currentHighlight.tl.y} />
      <label for="annotation-text">to x</label>
      <input type="date" bind:value={currentHighlight.br.x} />
      <label for="annotation-text">to y</label>
      <input type="number" bind:value={currentHighlight.br.y} />
      {#if !currentHighlightExists}
        <button onclick={() => (currentHighlight = undefined)}>Cancel</button>
      {/if}
      <button onclick={saveHighlight}
        >{#if currentHighlightExists}Done{:else}Save{/if}</button
      >
    {:else}
      <button onclick={() => (currentHighlight = { ...defaultHighlight })}>New Highlight</button>
    {/if}
    {#if visState.config.highlights.length > 0}
      <table>
        <tbody>
          {#each visState.config.highlights as highlight}
            <tr>
              <td>{Object.values(highlight.tl).join(', ')} → {Object.values(highlight.br).join(', ')}</td>
              <td class="button"><button onclick={() => (currentHighlight = highlight)}>Edit</button></td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </fieldset>
  <fieldset>
    <legend>Markers</legend>
    <MarkerAdmin
      projectName={PROJECT_NAME}
      prefixes={{
        'Scrolly mark': '#markCONFIG',
        'Scrolly opener': SCROLLY_OPENER_PREFIX
      }}
    />
  </fieldset>
  <fieldset>
    <legend>Fallbacks</legend>
    <ScreenshotTool
      prefixes={{
        'Scrolly mark': '#markCONFIG',
        'Scrolly opener': SCROLLY_OPENER_PREFIX
      }}
      iframeUrl={window.location.origin + window.location.pathname.replace('/builder/', '/')}
    />
  </fieldset>
  <details>
    <summary>Developer tools</summary>
    <fieldset>
      <label for="show-construction-marks"
        ><input id="show-construction-marks" type="checkbox" bind:checked={showConstructionMarks} /> Show construction marks</label
      >
    </fieldset>
  </details>
{/snippet}

<BuilderStyleRoot>
  <BuilderFrame {Viz} {Sidebar} />
</BuilderStyleRoot>

<style>
  .button {
    text-align: right;
  }
</style>

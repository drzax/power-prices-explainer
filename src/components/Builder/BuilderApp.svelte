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
    type DataSourceType,
    type DeletableType,
    type HighlightType,
    type SeriesType
  } from '../../lib/types';
  import { PROJECT_NAME, SCROLLY_MARK_PREFIX, SCROLLY_OPENER_PREFIX } from '../../lib/constants';

  import LineEditForm from './edit-forms/LineEditForm.svelte';
  import AnnotationEditForm from './edit-forms/AnnotationEditForm.svelte';
  import ArrowEditForm from './edit-forms/ArrowEditForm.svelte';
  import HighlightEditForm from './edit-forms/HighlightEditForm.svelte';
  import ItemCollection from './ItemCollection.svelte';
  import DataSourceEditForm from './edit-forms/DataSourceEditForm.svelte';

  const prefixes = {
    'Scrolly mark': '#markCONFIG',
    'Scrolly opener': SCROLLY_OPENER_PREFIX
  };

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
  const defaultDataSource = { label: '', url: '' };

  let currentAnnotation: (AnnotationType & DeletableType) | undefined = $state();
  let currentArrow: (ArrowType & DeletableType) | undefined = $state();
  let currentHighlight: (HighlightType & DeletableType) | undefined = $state();
  let currentLine: (SeriesType & DeletableType) | undefined = $state();
  let currentDataSource: (DataSourceType & DeletableType) | undefined = $state();

  let showConstructionMarks: boolean = $state(localStorage.getItem('showConstructionMarks') !== null);

  $effect(() => {
    if (showConstructionMarks) {
      localStorage.setItem('showConstructionMarks', 'true');
    } else {
      localStorage.removeItem('showConstructionMarks');
    }
  });

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
    <label class="item" for="chart-description">Description</label>
    <textarea id="chart-description" bind:value={visState.config.description}></textarea>
    <hr />
    <ItemCollection
      legend="Lines"
      bind:current={currentLine}
      template={defaultLine}
      bind:collection={visState.config.lines}
      itemLabelGetter={line => line.id}
    >
      {#snippet EditForm()}
        <LineEditForm bind:line={currentLine} />
      {/snippet}
    </ItemCollection>

    <ItemCollection
      legend="Annotations"
      bind:current={currentAnnotation}
      template={defaultAnnotation}
      bind:collection={visState.config.annotations}
      itemLabelGetter={annotation => annotation.label}
    >
      {#snippet EditForm()}
        <AnnotationEditForm bind:annotation={currentAnnotation} />
      {/snippet}
    </ItemCollection>

    <ItemCollection
      legend="Arrows"
      bind:current={currentArrow}
      template={defaultArrow}
      bind:collection={visState.config.arrows}
      itemLabelGetter={arrow => `${Object.values(arrow.from).join(', ')} → ${Object.values(arrow.to).join(', ')}`}
    >
      {#snippet EditForm()}
        <ArrowEditForm bind:arrow={currentArrow} />
      {/snippet}
    </ItemCollection>

    <ItemCollection
      legend="Highlights"
      bind:current={currentHighlight}
      template={defaultHighlight}
      bind:collection={visState.config.highlights}
      itemLabelGetter={highlight =>
        `${Object.values(highlight.tl).join(', ')} → ${Object.values(highlight.br).join(', ')}`}
    >
      {#snippet EditForm()}
        <HighlightEditForm bind:highlight={currentHighlight} />
      {/snippet}
    </ItemCollection>

    <ItemCollection
      legend="Credited sources of data"
      bind:current={currentDataSource}
      template={defaultDataSource}
      bind:collection={visState.config.sources}
      itemLabelGetter={source => source.label}
    >
      {#snippet EditForm()}
        <DataSourceEditForm bind:source={currentDataSource} />
      {/snippet}
    </ItemCollection>
  </fieldset>
  <fieldset>
    <legend>Markers</legend>
    <MarkerAdmin projectName={PROJECT_NAME} {prefixes} />
  </fieldset>
  <fieldset>
    <legend>Fallbacks</legend>
    <ScreenshotTool
      {prefixes}
      iframeUrl={window.location.origin + window.location.pathname.replace(/\/$/, '/iframe/')}
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
</style>

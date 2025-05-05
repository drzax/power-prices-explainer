<script lang="ts">
  import {
    Accordion,
    AccordionItem,
    MultiSelect,
    Select,
    Checkbox,
    TextInput,
    Button,
    Dropdown,
    NumberInput
  } from 'carbon-components-svelte';
  import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
  import Settings from 'carbon-icons-svelte/lib/Settings.svelte';
  import { visState } from '../../lib/state.svelte';
  import { data, pollsters, electorates, heldBy, years } from '../../lib/data';
  import { getTernaryCoordinatesFromResult } from '../../lib/data-accessors';
  import type { AnnotationType, ArrowType, CustomMarkType, HighlightType } from '../../lib/types';
  import { orientations, parties } from '../../lib/schemas';
  import Position from '../Position.svelte';

  let currentAnnotation: AnnotationType | null = $state(null);
  let currentCustomMark: CustomMarkType | null = $state(null);
  let currentHighlight: HighlightType | null = $state(null);
  let currentArrow: ArrowType | null = $state(null);

  let filteredData = $derived.by(() => {
    return data.filter(d => {
      const {
        filters: { year, electorate, party }
      } = visState.config;
      return (
        (year.length === 0 || year.includes(d.Year)) &&
        (electorate.length === 0 || electorate.includes(d.DivisionNm)) &&
        (party.length === 0 || party.includes(d.PartyAb))
      );
    });
  });

  const addAnnotation = () => {
    currentAnnotation = {
      text: 'New Annotation',
      orientation: 'middle',
      markLocation: [33, 33, 33],
      textLocation: [33, 33, 33],
      radius: 10
    };
    visState.config.annotations.push(currentAnnotation);
  };
  const addCustomMark = () => {
    currentCustomMark = {
      location: [33, 33, 33],
      party: 'OTH',
      orientation: 'middle'
    };
    visState.config.marks.push(currentCustomMark);
  };
  const addHighlight = () => {
    currentHighlight = {
      year: years[0],
      electorate: electorates[0],
      label: {
        orientation: 'middle',
        name: true,
        year: true
      }
    };
    visState.config.highlights.push(currentHighlight);
  };

  const addArrow = () => {
    currentArrow = {
      from: [33, 33, 33],
      to: [0, 33, 33]
    };
    visState.config.arrows.push(currentArrow);
  };

  $effect(() => {
    if (currentAnnotation || currentCustomMark || currentHighlight || currentArrow) {
      formModal.showModal();
    } else {
      formModal.close();
    }
  });

  let formModal: HTMLDialogElement;
  const closeFormModal = () => {
    currentAnnotation = null;
    currentCustomMark = null;
    currentHighlight = null;
    currentArrow = null;
  };
</script>

<div>
  <Accordion>
    <AccordionItem title="General" open>
      <TextInput bind:value={visState.config.title} labelText="Chart Title" />
      <Checkbox bind:checked={visState.config.displayCentralZone} labelText="Display central zone" />
      <Checkbox bind:checked={visState.config.displayTernaryOutline} labelText="Display outline" />
      <Checkbox bind:checked={visState.config.displaySegments} labelText="Display segments" />
      <Checkbox bind:checked={visState.config.displayAxes} labelText="Display axes" />
      <NumberInput
        label="Result marker opacity"
        bind:value={visState.config.resultMarkerOpacity}
        min={0}
        max={1}
        step={0.1}
      />
    </AccordionItem>

    <AccordionItem title="Axis labels">
      <TextInput bind:value={visState.config.axisLabels[0]} labelText="Top axis label" />
      <TextInput bind:value={visState.config.axisLabels[2]} labelText="Left axis label" />
      <TextInput bind:value={visState.config.axisLabels[1]} labelText="Right axis label" />
    </AccordionItem>

    <AccordionItem title="Filters">
      <Checkbox bind:checked={visState.config.nationalPolls} labelText="Show national polls" />
      <Checkbox bind:checked={visState.config.mrpPolls} labelText="Show MRP polls" />

      {#if visState.config.mrpPolls}
        <MultiSelect
          titleText="Pollsters"
          filterable
          bind:selectedIds={visState.config.filters.pollsters}
          items={[...pollsters.map(d => ({ id: d, text: d }))]}
          sortItem={() => {}}
        />
      {:else}
        <MultiSelect
          titleText="Election year"
          filterable
          bind:selectedIds={visState.config.filters.year}
          items={[{ id: 'none', text: 'None' }, ...years.map(d => ({ id: d, text: d.toString() }))]}
          sortItem={() => {}}
        />
      {/if}

      <MultiSelect
        titleText="Party"
        bind:selectedIds={visState.config.filters.party}
        items={heldBy.map(d => ({ id: d, text: d }))}
        sortItem={() => {}}
      />
      <MultiSelect
        titleText="Electorate"
        filterable
        bind:selectedIds={visState.config.filters.electorate}
        items={electorates.map(d => ({ id: d, text: d }))}
        sortItem={() => {}}
      />
    </AccordionItem>
    <AccordionItem title="Highlights" open>
      {#each visState.config.highlights as highlight, i (highlight)}
        <div class="row">
          <span>{highlight.electorate} {highlight.year}</span><span>
            <Button
              kind="danger-ghost"
              size="small"
              iconDescription="Delete"
              icon={TrashCan}
              onclick={() => visState.config.highlights.splice(i, 1)}
            ></Button>
            <Button
              kind="ghost"
              size="small"
              iconDescription="Edit"
              icon={Settings}
              onclick={() => {
                currentHighlight = highlight;
              }}
            ></Button>
          </span>
        </div>
      {/each}
      <Button size="small" onclick={addHighlight}>Add highlight</Button>
    </AccordionItem>
    <AccordionItem title="Annotations" open>
      {#each visState.config.annotations as annotation, i (annotation)}
        <div class="row">
          <span>{annotation.text}</span><span>
            <Button
              kind="danger-ghost"
              size="small"
              iconDescription="Delete"
              icon={TrashCan}
              onclick={() => visState.config.annotations.splice(i, 1)}
            ></Button>
            <Button
              kind="ghost"
              size="small"
              iconDescription="Edit"
              icon={Settings}
              onclick={() => {
                currentAnnotation = annotation;
              }}
            ></Button>
          </span>
        </div>
      {/each}
      <Button size="small" onclick={addAnnotation}>Add annotation</Button>
    </AccordionItem>
    <AccordionItem title="Custom marks" open>
      {#each visState.config.marks as mark, i (mark)}
        <div class="row">
          <span>{mark.label} ({mark.location.join(', ')})</span><span>
            <Button
              kind="danger-ghost"
              size="small"
              iconDescription="Delete"
              icon={TrashCan}
              onclick={() => visState.config.marks.splice(i, 1)}
            ></Button>
            <Button
              kind="ghost"
              size="small"
              iconDescription="Edit"
              icon={Settings}
              onclick={() => {
                currentCustomMark = mark;
              }}
            ></Button>
          </span>
        </div>
      {/each}
      <Button size="small" onclick={addCustomMark}>Add mark</Button>
    </AccordionItem>
    <AccordionItem title="Time arrows" open>
      <MultiSelect
        titleText="Electorate"
        filterable
        bind:selectedIds={visState.config.timeArrows}
        items={electorates.map(d => ({ id: d, text: d }))}
        sortItem={() => {}}
      />
    </AccordionItem>
    <AccordionItem title="Arrows">
      {#each visState.config.arrows as arrow, i (arrow)}
        <div class="row">
          <span>({arrow.from.join(', ')})→({arrow.to.join(', ')})</span><span>
            <Button
              kind="danger-ghost"
              size="small"
              iconDescription="Delete"
              icon={TrashCan}
              onclick={() => visState.config.arrows.splice(i, 1)}
            ></Button>
            <Button
              kind="ghost"
              size="small"
              iconDescription="Edit"
              icon={Settings}
              onclick={() => {
                currentArrow = arrow;
              }}
            ></Button>
          </span>
        </div>
      {/each}
      <Button size="small" onclick={addArrow}>Add arrow</Button>
    </AccordionItem>
  </Accordion>
</div>

<dialog bind:this={formModal} onclose={closeFormModal}>
  {#if currentHighlight}
    <h2>Edit Highlight</h2>
    <Dropdown
      titleText="Electorate"
      selectedId={currentHighlight.electorate}
      on:select={({ detail }) => {
        if (currentHighlight) currentHighlight.electorate = detail.selectedId;
      }}
      items={electorates.map(d => ({ id: d, text: d }))}
    />
    <Dropdown
      titleText="Year"
      selectedId={currentHighlight.year}
      on:select={({ detail }) => {
        if (currentHighlight) currentHighlight.year = detail.selectedId;
      }}
      items={years.map(d => ({ id: d, text: d.toString() }))}
    />
    <Dropdown
      size="sm"
      titleText="Label orientation"
      selectedId={currentHighlight.label.orientation}
      on:select={({ detail }) => {
        if (currentHighlight) {
          currentHighlight.label.orientation = detail.selectedId;
        }
      }}
      items={orientations.map(d => ({ id: d, text: d }))}
    />
    <Checkbox bind:checked={currentHighlight.label.name} labelText="Show electorate name" />
    <Checkbox bind:checked={currentHighlight.label.year} labelText="Show year" />
  {/if}
  {#if currentCustomMark}
    <h2>Edit custom mark</h2>
    <Position bind:position={currentCustomMark.location} />
    <Dropdown
      titleText="Party"
      selectedId={currentCustomMark.party}
      on:select={({ detail }) => {
        if (currentCustomMark) currentCustomMark.party = detail.selectedId;
      }}
      items={[{ id: 'blk', text: 'Black' }, ...parties.map(d => ({ id: d, text: d }))]}
    />
    <Dropdown
      size="sm"
      titleText="Label orientation"
      selectedId={currentCustomMark.orientation}
      on:select={({ detail }) => {
        if (currentCustomMark) {
          currentCustomMark.orientation = detail.selectedId;
        }
      }}
      items={orientations.map(d => ({ id: d, text: d }))}
    />
    <TextInput labelText="Label" bind:value={currentCustomMark.label} />
  {/if}

  {#if currentArrow}
    <h2>Edit arrow</h2>
    <h3>From</h3>
    <Position bind:position={currentArrow.from} />
    <h3>To</h3>
    <Position bind:position={currentArrow.to} />
  {/if}

  {#if currentAnnotation}
    <h2>Edit Annotation</h2>

    <Dropdown
      titleText="Annotate an electorate"
      selectedId={null}
      on:select={({ detail }) => {
        currentAnnotation.markLocation = getTernaryCoordinatesFromResult(detail.selectedItem);
        currentAnnotation.text = detail.selectedItem.DivisionNm;
      }}
      items={filteredData.map(d => ({ ...d, text: `${d.Year} ${d.DivisionNm}` }))}
    />

    <h3>Mark</h3>
    <NumberInput min={1} bind:value={currentAnnotation.radius} label="Radius" />
    <Position bind:position={currentAnnotation.markLocation} />

    <h3>Label</h3>
    <TextInput size="sm" labelText="Label text" bind:value={currentAnnotation.text} />
    <Position bind:position={currentAnnotation.textLocation} />

    <Dropdown
      size="sm"
      titleText="Orientation"
      selectedId={currentAnnotation.orientation}
      on:select={({ detail }) => {
        if (currentAnnotation) {
          currentAnnotation.orientation = detail.selectedId;
        }
      }}
      items={[
        { id: 'left', text: 'left' },
        { id: 'right', text: 'right' },
        { id: 'middle', text: 'middle' }
      ]}
    />
  {/if}
  <Button onclick={closeFormModal}>Close</Button>
</dialog>

<style>
  :global(.bx--accordion__title) {
    font-weight: bold;
  }

  :global(.bx--checkbox-wrapper) {
    flex-direction: row;
    margin-bottom: 0.5rem;
  }

  :global(.bx--multi-select__wrapper) {
    margin-bottom: 1rem;
  }

  :global(.bx--text-input-wrapper) {
    margin-bottom: 1rem;
  }

  :global(.bx--checkbox-label) {
    margin-left: 0.5rem;
  }

  :global(.bx--tile) {
    margin-bottom: 1rem;
  }

  :global(.bx--select) {
    margin-bottom: 1rem;
  }

  :global(.bx--number) {
    margin-bottom: 1rem;
  }

  dialog {
    width: 80vw;
    height: 80vh;
    border: none;
    border-radius: 5px;
  }
  ::backdrop {
    background-color: black;
    opacity: 0.75;
  }

  :global(tr.bx--parent-row.bx--expandable-row + tr[data-child-row] td) {
    padding-left: 1em;
  }

  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
</style>

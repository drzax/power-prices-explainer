<script lang="ts">
  import {
    Accordion,
    AccordionItem,
    MultiSelect,
    Checkbox,
    TextInput,
    DataTable,
    Toolbar,
    ToolbarContent,
    ToolbarSearch,
    ToolbarMenu,
    ToolbarMenuItem,
    Button,
    Toggle,
    Dropdown,
    TextInputSkeleton
  } from 'carbon-components-svelte';
  import { visualisationConfiguration } from '../../lib/state.svelte';
  import { data, electorates, heldBy, years } from '../../lib/data';

  const addElectorateLabel = () => {
    visualisationConfiguration.labels.push({
      id: visualisationConfiguration.labels.length,
      type: 'custom',
      text: 'New Custom Label',
      orientation: 'middle',
      markLocation: [33, 33, 33]
    });
    labelIndex = visualisationConfiguration.labels.length - 1;
    labelModal.showModal();
  };

  let labelIndex = $state(-1);

  let labelModal: HTMLDialogElement;
</script>

<div>
  <Accordion>
    <AccordionItem title="General" open>
      <TextInput bind:value={visualisationConfiguration.title} labelText="Chart Title" />
      <Checkbox bind:checked={visualisationConfiguration.displayCentralZone} labelText="Display central zone" />
    </AccordionItem>

    <AccordionItem title="Filters">
      <MultiSelect
        titleText="Election year"
        bind:selectedIds={visualisationConfiguration.yearFilters}
        items={years.map(d => ({ id: d, text: d.toString() }))}
        sortItem={() => {}}
      />
      <MultiSelect
        titleText="Party"
        bind:selectedIds={visualisationConfiguration.partyFilters}
        items={heldBy.map(d => ({ id: d, text: d }))}
        sortItem={() => {}}
      />
      <MultiSelect
        titleText="Electorate"
        bind:selectedIds={visualisationConfiguration.electorateFilters}
        items={electorates.map(d => ({ id: d, text: d }))}
        sortItem={() => {}}
      />
    </AccordionItem>
    <AccordionItem title="Labels">
      <DataTable
        size="short"
        title="Electorate labels"
        rows={visualisationConfiguration.labels}
        headers={[
          { key: 'text', value: 'Text' },
          { key: 'type', value: 'Type' }
        ]}
        expandable
      >
        <Toolbar size="sm">
          <ToolbarContent>
            <ToolbarSearch />
            <ToolbarMenu>
              <ToolbarMenuItem hasDivider danger>Stop all</ToolbarMenuItem>
            </ToolbarMenu>
            <Button onclick={addElectorateLabel}>Add</Button>
          </ToolbarContent>
        </Toolbar>
        <svelte:fragment slot="expanded-row" let:row>
          <Dropdown
            size="sm"
            titleText="Type"
            selectedId={row.type}
            on:select={({ detail }) => (row.type = detail.selectedId)}
            items={[
              { id: 'custom', text: 'custom' },
              { id: 'result', text: 'result' }
            ]}
          />
          {#if row.type === 'custom'}
            <p>Position</p>
          {/if}
          {#if row.type === 'result'}
            <Dropdown
              size="sm"
              titleText="Result"
              selectedId={row.result}
              on:select={({ detail }) => (row.result = detail.selectedId)}
              items={data.map(d => ({ id: d.id, text: d.id }))}
            />
          {/if}
          <TextInput size="sm" labelText="Label text" bind:value={row.text} />
          <Dropdown
            size="sm"
            titleText="Orientation"
            selectedId={row.orientation}
            on:select={({ detail }) => (row.orientation = detail.selectedId)}
            items={[
              { id: 'left', text: 'left' },
              { id: 'right', text: 'right' },
              { id: 'middle', text: 'middle' }
            ]}
          />
        </svelte:fragment>
      </DataTable>
    </AccordionItem>
  </Accordion>
</div>
<dialog bind:this={labelModal}>
  <h1>Edit label</h1>
  <Toggle labelText="Link to result?" labelA="Custom position" labelB="Linked to result" />
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
</style>

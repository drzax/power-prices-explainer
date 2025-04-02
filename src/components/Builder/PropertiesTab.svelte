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
    Button
  } from 'carbon-components-svelte';
  import { visualisationConfiguration } from '../../lib/state.svelte';
  import { electorates, heldBy, years } from '../../lib/data';

  const addElectorateLabel = () => {
    visualisationConfiguration.labels.push({
      id: 'custom',
      template: '{electorate}',
      orientation: 'middle',
      type: 'custom',
      markLocation: [33, 33, 33]
    });
  };

  // let labelModal: HTMLDialogElement;
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
        headers={[{ key: 'id', value: 'ID' }]}
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
      </DataTable>
    </AccordionItem>
  </Accordion>
</div>

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
</style>

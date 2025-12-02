<script lang="ts">
  import {
    Accordion,
    AccordionItem,
    MultiSelect,
    Checkbox,
    TextInput,
    Button,
    Dropdown,
    NumberInput,
    DataTable,
    Grid,
    Row,
    Column,
    Toolbar,
    ToolbarContent,
    ToolbarSearch,
    ToolbarMenu,
    ToolbarMenuItem,
    Slider,
    DatePickerInput,
    DatePicker
  } from 'carbon-components-svelte';
  import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
  import Settings from 'carbon-icons-svelte/lib/Settings.svelte';
  import { visState } from '../../lib/state.svelte';
  import { data } from '../../lib/data.svelte';

  import { orientations } from '../../lib/schemas';
  import Position from './Position.svelte';
  import { Add, Delete, Edit } from 'carbon-icons-svelte';
  import { format, parse } from 'date-fns';
  import AnnotationEditForm from './AnnotationEditForm.svelte';
  import ArrowEditForm from './ArrowEditForm.svelte';

  let currentAnnotationIndex: number | undefined = $state();
  let currentAnnotation = $derived(
    currentAnnotationIndex !== undefined && visState.config.annotations[currentAnnotationIndex]
  );
  let currentArrowIndex: number | undefined = $state();
  let currentArrow = $derived(currentArrowIndex !== undefined && visState.config.arrows[currentArrowIndex]);
  let formModal: HTMLDialogElement | undefined = $state();
</script>

<div>
  <Accordion>
    <AccordionItem title="General" open>
      <TextInput bind:value={visState.config.title} labelText="Chart Title" />
    </AccordionItem>
  </Accordion>
  <DataTable
    headers={[
      { key: 'label', value: 'Label' },
      { key: 'id', value: '' }
    ]}
    rows={visState.config.annotations.map((d, idx) => ({ ...d, id: idx }))}
  >
    <Toolbar>
      <ToolbarContent>
        <Button
          kind="tertiary"
          onclick={() => {
            visState.config.annotations.push({ label: 'Label text', x: 0, y: 0 });
            currentAnnotationIndex = visState.config.annotations.length - 1;
            formModal?.showModal();
          }}>Add annotation</Button
        >
      </ToolbarContent>
    </Toolbar>
    <svelte:fragment slot="cell" let:row let:cell>
      {#if cell.key === 'id'}
        <Button
          size="small"
          kind="danger-ghost"
          icon={TrashCan}
          onclick={() => {
            visState.config.annotations = [
              ...visState.config.annotations.slice(0, cell.value),
              ...visState.config.annotations.slice(cell.value + 1)
            ];
          }}
        />
        <Button
          size="small"
          icon={Edit}
          kind="ghost"
          onclick={() => {
            currentAnnotationIndex = cell.value;
            formModal?.showModal();
          }}
        />
      {:else}
        {cell.value}
      {/if}
    </svelte:fragment>
  </DataTable>
  <DataTable
    headers={[
      { key: 'from', value: 'from' },
      { key: 'to', value: 'to' },
      { key: 'id', value: '' }
    ]}
    rows={visState.config.arrows.map((d, idx) => ({ ...d, id: idx }))}
  >
    <Toolbar>
      <ToolbarContent>
        <Button
          kind="tertiary"
          onclick={() => {
            visState.config.arrows.push({ from: { x: 0, y: 0 }, to: { x: 0, y: 0 } });
            currentArrowIndex = visState.config.arrows.length - 1;
            formModal?.showModal();
          }}>Add arrow</Button
        >
      </ToolbarContent>
    </Toolbar>
    <svelte:fragment slot="cell" let:row let:cell>
      {#if cell.key === 'id'}
        <Button
          size="small"
          kind="danger-ghost"
          icon={TrashCan}
          onclick={() => {
            visState.config.arrows = [
              ...visState.config.arrows.slice(0, cell.value),
              ...visState.config.arrows.slice(cell.value + 1)
            ];
          }}
        />
        <Button
          size="small"
          icon={Edit}
          kind="ghost"
          onclick={() => {
            currentArrowIndex = cell.value;
            formModal?.showModal();
          }}
        />
      {:else}
        {cell.value}
      {/if}
    </svelte:fragment>
  </DataTable>
</div>
<dialog bind:this={formModal}>
  <AnnotationEditForm {currentAnnotation} />
  <ArrowEditForm {currentArrow} />
  <Button
    onclick={() => {
      currentAnnotationIndex = undefined;
      currentArrowIndex = undefined;
      formModal?.close();
    }}>Close</Button
  >
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

  ::backdrop {
    background-color: black;
    opacity: 0.75;
  }

  :global(tr.bx--parent-row.bx--expandable-row + tr[data-child-row] td) {
    padding-left: 1em;
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

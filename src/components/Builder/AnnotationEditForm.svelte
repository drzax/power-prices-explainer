<script lang="ts">
  import { DatePicker, DatePickerInput, NumberInput, TextInput } from 'carbon-components-svelte';
  import { format, parse } from 'date-fns';

  let { currentAnnotation } = $props();
</script>

{#if currentAnnotation}
  <h2>Edit annotation</h2>
  <TextInput bind:value={currentAnnotation.label} labelText="Annotation text" />

  <DatePicker
    datePickerType="single"
    dateFormat="d/m/Y"
    on:change
    bind:value={
      () => format(currentAnnotation.x, 'd/M/y'), d => (currentAnnotation.x = parse(d, 'dd/MM/yyyy', new Date()))
    }
  >
    <DatePickerInput labelText="X location" placeholder="dd/mm/yy" />
  </DatePicker>

  <NumberInput bind:value={currentAnnotation.y} labelText="Y location" />
{/if}

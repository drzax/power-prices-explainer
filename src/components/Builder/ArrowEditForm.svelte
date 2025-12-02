<script lang="ts">
  import { DatePicker, DatePickerInput, NumberInput, TextInput } from 'carbon-components-svelte';
  import { format, parse } from 'date-fns';

  let { currentArrow } = $props();
</script>

{#if currentArrow}
  <h2>Edit arrow</h2>
  <h3>From</h3>
  <DatePicker
    datePickerType="single"
    dateFormat="d/m/Y"
    on:change
    bind:value={
      () => format(currentArrow.from.x, 'd/M/y'), d => (currentArrow.from.x = parse(d, 'dd/MM/yyyy', new Date()))
    }
  >
    <DatePickerInput labelText="X location" placeholder="dd/mm/yy" />
  </DatePicker>

  <NumberInput bind:value={currentArrow.from.y} labelText="Y location" />
  <h3>To</h3>
  <DatePicker
    datePickerType="single"
    dateFormat="d/m/Y"
    on:change
    bind:value={() => format(currentArrow.to.x, 'd/M/y'), d => (currentArrow.to.x = parse(d, 'dd/MM/yyyy', new Date()))}
  >
    <DatePickerInput labelText="X location" placeholder="dd/mm/yy" />
  </DatePicker>

  <NumberInput bind:value={currentArrow.to.y} labelText="Y location" />
{/if}

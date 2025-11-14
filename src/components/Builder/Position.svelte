<script lang="ts">
  import { NumberInput } from 'carbon-components-svelte';

  var { position = $bindable() } = $props();
</script>

<div class="position-field">
  <NumberInput max={100} min={0} size="sm" bind:value={position[0]} label="Position on A (up) axis" />
  <NumberInput max={100} min={0} size="sm" bind:value={position[1]} label="Position on B (left) axis" />
  <NumberInput max={100} min={0} size="sm" bind:value={position[2]} label="Position on C (right) axis" />
</div>
<p><small><em>Positions are normalised to a range of 0-100 before being plotted.</em></small></p>

<style>
  .position-field {
    display: flex;
    flex-direction: row;
  }
  .position-field > :global(*) {
    margin-right: 5px;
  }
  .position-field > :global(*:last-child) {
    margin-right: 0;
  }

  .position-field :global(.bx--number--sm.bx--number input[type='number']) {
    padding-right: 5.5em;
  }
</style>

<script lang="ts">
  export let value: string;
  export let labelText: string;
  export let items: { id: string; label: string }[] = [];
</script>

<div class="fieldset">
  <label>
    <span>{labelText}</span>
    <select name="layout" bind:value>
      {#each items as item}
        <option value={item.id}>{item.label}</option>
      {/each}
    </select>
  </label>
</div>

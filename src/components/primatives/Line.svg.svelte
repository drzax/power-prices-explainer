<svelte:options namespace="svg" />

<script lang="ts">
  interface Props {
    stroke?: string;
    path: string;
  }

  let { stroke = '#ab00d6', path }: Props = $props();
</script>

<path class="path-line" d={path} {stroke}></path>

<style>
  .path-line {
    fill: none;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 2;
  }
</style>

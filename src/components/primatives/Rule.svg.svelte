<svelte:options namespace="svg" />

<script lang="ts">
  interface Props {
    stroke?: string;
    x2: number;
    x1: number;
    y2: number;
    y1: number;
  }

  let { stroke = '#ab00d6', x1, y1, x2, y2 }: Props = $props();
</script>

<line class="rule" {x1} {x2} {y1} {y2} />

<style>
  .rule {
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 2;
  }
</style>

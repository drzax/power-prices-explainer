<script lang="ts">
  let { children } = $props();
</script>

<svg width="100%" height="100%">
  {@render children?.()}
</svg>

<style>
  svg {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    :global(> *) {
      pointer-events: auto;
    }
  }
</style>

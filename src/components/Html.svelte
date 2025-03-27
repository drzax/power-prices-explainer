<script>
  let { children } = $props();
</script>

<div>
  {@render children?.()}
</div>

<style>
  div {
    width: 100%;
    height: 100%;
  }
</style>

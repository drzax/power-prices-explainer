<script>
  let { children } = $props();
</script>

<div>
  {@render children?.()}
</div>

<style>
  div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>

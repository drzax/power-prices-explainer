<script lang="ts">
  import { onMount } from 'svelte';

  let { children, footerChildren, title = '', onClose = () => {} } = $props();
  let dialogEl = $state<HTMLDialogElement | undefined>();
  let rect = $state<DOMRect>();
  $effect(() => {
    if (dialogEl) {
      rect = dialogEl.getBoundingClientRect();
    }
  });
  onMount(() => {
    dialogEl?.showModal();
    return () => {
      dialogEl?.close();
    };
  });

  /* Proxy required otherwise Typescript complains */
  function onCloseTypescriptProxy() {
    onClose();
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog class="modal" bind:this={dialogEl} onclick={onCloseTypescriptProxy} onclose={onCloseTypescriptProxy}>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div onclick={e => e.stopPropagation()}>
    {#if title}
      <div class="modal-title">
        <h1>
          {title}
        </h1>
        <button class="modal-close" onclick={onCloseTypescriptProxy}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-x"
            viewBox="0 0 16 16"
          >
            <title>Close</title>
            <path
              d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"
            />
          </svg>
        </button>
      </div>
    {/if}

    <div class="modal-content">
      {@render children?.()}
    </div>
    {#if footerChildren}
      <div class="modal-footer">
        {@render footerChildren?.()}
      </div>
    {/if}
  </div>
</dialog>

<style lang="scss">
  .modal {
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    margin: 0;
    padding: 0;
    background: var(--background);
    color: var(--text);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    animation: fadein 0.2s;
    &::backdrop {
      animation: fadein 0.2s;
      background: rgba(0, 0, 0, 0.8);
    }
  }

  .modal-title {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 0.5rem 0.5rem 1rem;
    gap: 1rem;
    border-bottom: 1px solid var(--border);
  }
  .modal-title h1 {
    font-size: 1rem;
    margin: 0;
    padding: 0;
    flex: 1;
  }
  button.modal-close {
    width: 2rem;
    border: none;
    height: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .modal-content {
    padding: 0.5rem 1rem;
    max-height: 50vh;
    overflow: auto;
  }
  .modal-footer {
    text-align: right;
    border-top: 1px solid var(--border);
    padding: 0.5rem 1rem;
  }
  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>

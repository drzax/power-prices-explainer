<script lang="ts" generics="Item extends { deleted?: number }">
  import { untrack } from 'svelte';
  import Pencil from 'svelte-bootstrap-icons/lib/Pencil.svelte';
  import ButtonGroup from './ButtonGroup.svelte';

  interface Props {
    items: Item[];
    edit(item: Item): void;
    getLabel?(item: Item, idx: number): string;
    deleteDelay?: number;
  }

  let { items = $bindable(), edit, deleteDelay = 5000, getLabel = (item, idx) => `Item ${idx}` }: Props = $props();

  let deleteItemInterval = $state<NodeJS.Timeout>();

  $effect(() => {
    const shouldKeep = (item: Item) => typeof item.deleted === 'undefined' || item.deleted > Date.now() - deleteDelay;
    deleteItemInterval = setInterval(() => {
      const _items = untrack(() => items);
      if (!_items.every(shouldKeep)) {
        items = _items.filter(shouldKeep);
      }
    }, 1000);

    return () => {
      clearTimeout(deleteItemInterval);
    };
  });
</script>

{#snippet deleteIcon()}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    class="bi bi-trash"
    viewBox="0 0 16 16"
  >
    <path
      d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"
    />
    <path
      d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"
    />
  </svg>
{/snippet}

{#snippet undeleteIcon()}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    class="bi bi-arrow-counterclockwise"
    viewBox="0 0 16 16"
  >
    <path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z" />
    <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466" />
  </svg>
{/snippet}

{#if items.length > 0}
  <ol>
    {#each items as item, idx}
      <li>
        <span role="button" tabindex="0" onkeyup={e => e.key === ' ' && edit(item)} onclick={() => edit(item)}
          >{getLabel(item, idx)}</span
        >
        <ButtonGroup>
          <button onclick={() => edit(item)}><Pencil height="16" width="16" /></button>
          <button
            onclick={e => {
              e.preventDefault();
              if (item.deleted) {
                delete item.deleted;
              } else {
                item.deleted = Date.now();
              }
            }}
            title={item.deleted ? 'Undo delete' : 'Delete marker'}
          >
            {#if item.deleted}
              {@render undeleteIcon()}
            {:else}
              {@render deleteIcon()}
            {/if}
          </button>
        </ButtonGroup>
      </li>
    {/each}
  </ol>
{/if}

<style>
  ol {
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
  }

  li {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 2px;

    padding-bottom: 0.2em;
    &:not(:last-child) {
      margin-bottom: 0.2em;
    }

    button {
      height: 32px;
    }
  }
</style>

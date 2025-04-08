<script lang="ts">
  import { mount, onMount } from 'svelte';
  import { visState } from '../lib/state.svelte';
  import { decode } from '@abcnews/base-36-props';
  import { electorates, data } from '../lib/data';
  import { parties } from '../lib/constants';

  import Scrollyteller from '@abcnews/svelte-scrollyteller';
  import Visualisation from './Visualisation.svelte';
  import Mark from './Mark.svg.svelte';

  const updateState = detail => {
    try {
      visState.config = decode(detail.config);
      visState.loaded = true;
    } catch (e) {
      console.error(e, detail);
    }
  };

  //
  // Find any bolded electorate names in the panel copy, and enhance them visually
  //
  let { panels } = $props();
  let annotatedPanels = $derived.by(() => panels.map(p =>
    ({
      align: p.align,
      data: p.data,
      nodes: p.nodes.map(n => {
        const panelData = decode(p.data.config);
        const year = panelData.filters.year[0] || '2022';
        for (let i = 0; i < n.childNodes.length; i++) {
          const child = n.childNodes[i];
          if (child.nodeName === 'STRONG' && electorates.indexOf(child.innerText) > -1) {
            enhanceText(child, year);
          }
        }
        return n;
      }),
    })
  ));

  //
  // Replace electorate names with the party colours of the winner for that year (based on the
  // filters in the marker data).
  //
  const enhanceText = (child, year) => {
    const result = data.find(d => d.DivisionNm === child.innerText && d.Year === year);
    child.classList.add('electorate-label');
    child.classList.add(`electorate-label-${result.PartyAb.toLowerCase()}`);

    const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgEl.setAttribute('width', '15');
    svgEl.setAttribute('height', '15');
    svgEl.setAttribute('style', 'margin-right: 2px;');
    child.prepend(svgEl);

    const variant = parties.get(result.PartyAb.toLocaleLowerCase())?.shape || 'none';

    mount(Mark, {
      target: svgEl,
      props: {
        size: 'md',
        variant,
        x: 7.5,
        y: 7.5,
        '--marker-color': `var(--pty-color-${result.PartyAb.toLowerCase()})`
      },
    });
  };
</script>

<Scrollyteller
  panels={annotatedPanels}
  onMarker={updateState}
  layout={{ align: 'left', mobileVariant: 'rows', resizeInteractive: true }}
>
  <Visualisation />
</Scrollyteller>

<style>

  :global(.electorate-label) {
    --pty-color-alp: #B91321;
    --pty-color-lnp: #0041A3;
    --pty-color-oth: #404040;

    --pty-color-bg-lnp: #CEDCF2;
    --pty-color-bg-alp: #F9D2D6;
    --pty-color-bg-oth: #E3E3E3;

    padding: 2px;
    padding-right: 6px;
    padding-left: 4px;
    border-radius: 3px;
    text-wrap-mode: nowrap;
  }

  :global(.electorate-label-lnp) {
    color: var(--pty-color-lnp);
    background: var(--pty-color-bg-lnp);
  }
  :global(.electorate-label-alp) {
    color: var(--pty-color-alp);
    background: var(--pty-color-bg-alp);
  }
  :global(.electorate-label-oth) {
    color: var(--pty-color-oth);
    background: var(--pty-color-bg-oth);
  }
</style>

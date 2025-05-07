<script lang="ts">
  import { mount, onMount } from 'svelte';
  import { visState } from '../lib/state.svelte';
  import { decode } from '@abcnews/base-36-props';
  import { data, electorates } from '../lib/data.svelte';
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

  const SPECIAL_CASES = {
    red: 'alp',
    blue: 'lnp',
    grey: 'oth'
  };

  //
  // Find any bolded electorate names in the panel copy, and enhance them visually
  //
  let { panels } = $props();
  let annotatedPanels = $derived.by(() =>
    panels.map(p => ({
      align: p.align,
      data: p.data,
      nodes: p.nodes.map(n => {
        const panelData = decode(p.data.config);
        const year = panelData.filters.year[0] || '2022';
        for (let i = 0; i < n.childNodes.length; i++) {
          const child = n.childNodes[i];
          if (child.nodeName === 'STRONG' && Object.keys(SPECIAL_CASES).indexOf(child.innerText.toLowerCase()) > -1) {
            enhanceText(child, year, SPECIAL_CASES[child.innerText.toLowerCase()]);
            continue;
          }
          if (child.nodeName === 'STRONG' && electorates.indexOf(child.innerText) > -1) {
            const seatResult = data.results.find(d => d.DivisionNm === child.innerText && d.Year === year);
            enhanceText(child, year, seatResult.PartyAb.toLowerCase());
          }
        }
        return n;
      })
    }))
  );

  //
  // Replace electorate names with the party colours of the winner for that year (based on the
  // filters in the marker data).
  //
  const enhanceText = (child, year, party) => {
    child.classList.add('electorate-label');
    child.classList.add(`electorate-label-${party}`);
    const variant = parties.get(party)?.shape || 'none';

    const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgEl.setAttribute('width', '16');
    svgEl.setAttribute('height', '16');
    child.prepend(svgEl);

    const colourVar = `var(--pty-color-icon-${party})`;

    let x = 7.5;
    let y = 9;

    if (variant === 'square') {
      svgEl.setAttribute('style', `margin-right: 1px; padding-top: 2px; color: ${colourVar}`);
    } else if (variant === 'circle') {
      svgEl.setAttribute('style', `margin-right: 1px; padding-top: 1px; color: ${colourVar}`);
    } else {
      svgEl.setAttribute('style', `margin-right: 0.5px; padding-top: 2px; color: ${colourVar}`);
      x -= 0.5;
      y -= 1;
    }

    mount(Mark, {
      target: svgEl,
      props: {
        size: 'md',
        disableResponsiveSizing: true,
        variant,
        x,
        y
      }
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
  @media (max-width: 62rem) {
    :global(.viz) {
      transform: translateY(-20px) !important;
      max-height: calc(42dvh + 50px) !important;
    }
  }

  /* override dark mode */
  :global(.st-panel p) {
    color: black !important;
  }

  :global(.electorate-label) {
    --pty-color-alp: #b91321;
    --pty-color-lnp: #0041a3;
    --pty-color-oth: #404040;

    --pty-color-icon-alp: #e11f30;
    --pty-color-icon-lnp: #0a52bf;
    --pty-color-icon-oth: #757575;

    --pty-color-bg-lnp: #cedcf2;
    --pty-color-bg-alp: #f9d2d6;
    --pty-color-bg-oth: #e3e3e3;

    padding-bottom: 2px;
    padding-right: 5px;
    padding-left: 4px;

    /* Deal with Firefox weirdness.. */
    padding-top: 4px;
    -webkit-padding-before: 2px;
    /* -- */

    border-radius: 3px;
    text-wrap-mode: nowrap;

    /* in-text labels slightly smaller than other text to retain balance */
    font-size: calc(var(--od-font-size) - 2px);
  }

  @media (min-width: 90rem) {
    :global(.electorate-label) {
      font-size: calc(1.25rem - 2px);
    }
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

  /* Style the header */
  @media (max-width: 62rem) {
    :global(.st-panel-root.first) {
      margin-top: 98dvh !important;

      :global(.st-panel) {
        padding-top: 0;
      }
    }
  }

  :global(.Header-content),
  :global(.Header) {
    width: auto !important;

    :global(h1) {
      margin-top: 0;
    }
  }
</style>

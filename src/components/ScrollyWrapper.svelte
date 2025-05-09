<script lang="ts">
  import { mount } from 'svelte';
  import { data } from '../lib/data.svelte';
  import { parties } from '../lib/constants';
  import Scrollyteller from '@abcnews/svelte-scrollyteller';
  import Visualisation from './Visualisation.svelte';
  import Mark from './Mark.svg.svelte';
  import { loadMarkerConfig } from '../lib/data-accessors';
  import { type ResultType, type PartyAbbreviationType } from '../lib/types';

  const updateState = (detail: { config: string }) => {
    try {
      loadMarkerConfig(detail.config);
    } catch (e) {
      console.error(e, detail);
    }
  };

  const SPECIAL_CASES = {
    red: 'alp',
    blue: 'lnp',
    grey: 'oth',
    triangle: 'in-doubt'
  };

  const electorates = $derived.by(() => {
    if (!data.results) return undefined;
    const uniqueElectorates = new Set<string>();
    data.results.forEach(d => {
      if (d.DivisionNm) uniqueElectorates.add(d.DivisionNm);
    });
    return Array.from(uniqueElectorates).sort();
  });

  //
  // Find any bolded electorate names in the panel copy, and enhance them visually
  //
  let { panels } = $props();
  $effect(() =>
    panels.forEach(p => {
      p.nodes.forEach(n => {
        for (let i = 0; i < n.childNodes.length; i++) {
          const child = n.childNodes[i];
          if (
            child.nodeName === 'STRONG' &&
            Object.keys(SPECIAL_CASES).indexOf(child.innerText.toLowerCase()) > -1 &&
            !child.classList.contains('electorate-label')
          ) {
            enhanceText(child, SPECIAL_CASES[child.innerText.toLowerCase()]);
            continue;
          }
          if (
            child.nodeName === 'STRONG' &&
            electorates &&
            electorates.map(d => d.toLocaleLowerCase()).indexOf(child.innerText.toLocaleLowerCase()) > -1
          ) {
            const seatResults = data.results?.filter(
              d => d.DivisionNm.toLocaleLowerCase() === child.innerText.toLocaleLowerCase()
            );
            const latestSeatResult = seatResults?.reduce<ResultType | undefined>((max, d) => {
              if (max === undefined || d.Year > max.Year) {
                return d;
              }
              return max;
            }, undefined);

            if (latestSeatResult) enhanceText(child, latestSeatResult.PartyAb);
          }
        }
        return n;
      });
    })
  );

  //
  // Replace electorate names with the party colours of the winner for that year (based on the
  // filters in the marker data).
  //
  const enhanceText = (child: HTMLElement, party: PartyAbbreviationType) => {
    if (child.classList.contains('electorate-label')) {
      return;
    }
    child.classList.add('electorate-label');
    child.classList.add(`electorate-label-${party.replace(' ', '-').toLocaleLowerCase()}`);
    const variant = parties.get(party.toLowerCase())?.shape || 'triangle';

    const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgEl.setAttribute('width', '16');
    svgEl.setAttribute('height', '16');
    child.prepend(svgEl);

    const colourVar = `var(--pty-color-icon-${party.replace(' ', '-').toLocaleLowerCase()})`;

    let x = 7.5;
    let y = 9;

    if (variant === 'square') {
      svgEl.setAttribute('style', `margin-right: 1px; padding-top: 2px; color: ${colourVar}`);
    } else if (variant === 'circle') {
      svgEl.setAttribute('style', `margin-right: 1px; padding-top: 1px; color: ${colourVar}`);
    } else if (variant === 'triangle') {
      svgEl.setAttribute('style', `margin-right: 1px; padding-top: 3px; color: ${colourVar}`);
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
  {panels}
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
    --pty-color-in-doubt: #404040;

    --pty-color-icon-alp: #e11f30;
    --pty-color-icon-lnp: #0a52bf;
    --pty-color-icon-oth: #757575;

    --pty-color-bg-lnp: #cedcf2;
    --pty-color-bg-alp: #f9d2d6;
    --pty-color-bg-oth: #e3e3e3;
    --pty-color-bg-in-doubt: #fff;

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
  :global(.electorate-label-in-doubt) {
    color: var(--pty-color-in-doubt);
    background: var(--pty-color-bg-in-doubt);
    border: 1px solid #444;
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

import { scaleLinear } from 'd3-scale';

import type { VisualisationType } from './types';
import { extent } from 'd3-array';
import { data } from './data.svelte';
import { symbol } from 'valibot';

export const visState: { config: VisualisationType; loaded: boolean } = $state({
  config: {
    title: 'arbitrary',
    padding: 5,
    scales: [
      {
        name: 'x',
        type: 'linear',
        domain: [0, 1], // extent(data.map(d => d.date)),
        range: [0, 500]
      },
      {
        name: 'y',
        type: 'linear',
        domain: [0, 1], //extent(data.flatMap(d => (d.incl ? [d.excl, d.incl] : [d.excl]))),
        range: [300, 0]
      }
    ],
    annotations: [],
    arrows: [],
    marks: [
      {
        type: 'symbol',
        from: 'table',
        encode: {
          enter: {
            cx: { scale: 'x', field: 'date' },
            cy: { scale: 'y', field: 'excl' }
          }
        }
      }
    ],
    axes: []
  },
  loaded: false
});

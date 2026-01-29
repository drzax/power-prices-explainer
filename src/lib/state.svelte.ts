import type { VisualisationType } from './types';

export const visState: { config: VisualisationType; loaded: boolean } = $state({
  config: {
    title: 'Power prices',
    annotations: [],
    arrows: [],
    lines: [],
    highlights: []
  },
  loaded: false
});

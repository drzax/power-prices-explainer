import type { VisualisationType } from './types';

export const visState: { config: VisualisationType; loaded: boolean } = $state({
  config: {
    title: 'arbitrary',
    annotations: [],
    arrows: [],
    lines: []
  },
  loaded: false
});

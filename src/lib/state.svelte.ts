import type { VisualisationInputType } from './types';

export const visState: { config: VisualisationInputType; loaded: boolean } = $state({
  data: [],
  config: {
    title: 'Chart title'
  },
  loaded: false
});

import { barycentric } from 'd3-ternary';
import type { VisConfig } from './types';

export const plot = $state({ width: 100, height: 100, axisLength: 0 });
export const scale = barycentric();

export const visualisationConfiguration: VisConfig = $state({
  title: '',
  axisLabels: [],
  displayTernaryOutline: true,
  displayCentralZone: false,
  deemphasiseSectors: [false, false, false],
  arrows: [],
  electorateHighlights: [],
  electorateFilters: [],
  yearFilters: [],
  partyFilters: [],
  labels: []
});

import type { VisConfigType } from './types';

export const parties = [
  {
    id: 'lab',
    label: '100% ALP',
    gradientStops: [
      { offset: '25%', color: '#FCE9EB' },
      { offset: '75%', color: '#F6BCC1' },
      { offset: '100%', color: '#ea626e' }
    ]
  },
  {
    id: 'oth',
    label: '100% Other candidates',
    gradientStops: [
      { offset: '25%', color: '#f2f2f2' },
      { offset: '75%', color: '#c4c4c4' },
      { offset: '100%', color: '#919191' }
    ]
  },
  {
    id: 'lnp',
    label: '100% LNP',
    gradientStops: [
      { offset: '25%', color: '#EBF1FA' },
      { offset: '75%', color: ' #B2C9EB' },
      { offset: '100%', color: ' #608fd5' }
    ]
  }
];

export const defaultVisConfig: VisConfigType = {
  title: '',
  axisLabels: [],
  displayTernaryOutline: true,
  displayCentralZone: false,
  deemphasiseSectors: [false, false, false],
  arrows: [],
  electorateFilters: [],
  yearFilters: [],
  partyFilters: [],
  labels: []
};

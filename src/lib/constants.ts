import { type PartyConstantsType, type VisConfigType } from './types';

export const parties = new Map<string, PartyConstantsType>([
  [
    'alp',
    {
      label: '100% ALP',
      shape: 'circle',
      gradientStops: [
        { offset: '25%', color: '#FCE9EB' },
        { offset: '75%', color: '#F6BCC1' },
        { offset: '100%', color: '#ea626e' }
      ]
    }
  ],
  [
    'oth',
    {
      label: '100% Other candidates',
      shape: 'square',
      gradientStops: [
        { offset: '25%', color: '#f2f2f2' },
        { offset: '75%', color: '#c4c4c4' },
        { offset: '100%', color: '#919191' }
      ]
    }
  ],
  [
    'lnp',
    {
      label: '100% LNP',
      shape: 'diamond',
      gradientStops: [
        { offset: '25%', color: '#EBF1FA' },
        { offset: '75%', color: ' #B2C9EB' },
        { offset: '100%', color: ' #608fd5' }
      ]
    }
  ]
]);

export const defaultVisConfig: VisConfigType = {
  title: '',
  axisLabels: [],
  displayTernaryOutline: true,
  displayCentralZone: false,
  deemphasiseSectors: [false, false, false],
  arrows: [],
  filters: { year: [], electorate: [], party: [] },
  highlights: [],
  marks: [],
  annotations: []
};

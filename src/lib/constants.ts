import { type Marker, type PartyConstantsType, type VisConfigType } from './types';

export const MARKER_NAME = 'electionternaryplots';

export const LARGE_TABLET_BREAKPOINT = 992;
export const DESKTOP_BREAKPOINT = 1500;

export const plotMargins = {
  top: 40,
  right: 40,
  bottom: 20,
  left: 40
};

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
      shape: 'diamond',
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
      shape: 'square',
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
  displayTernaryOutline: false,
  displaySegments: true,
  displayAxes: true,
  displayCentralZone: false,
  resultMarkerOpacity: 0.5,
  deemphasiseSectors: [false, false, false],
  arrows: [],
  nationalPolls: false,
  filters: { year: [], electorate: [], party: [] },
  highlights: [],
  marks: [],
  annotations: []
};

export const MARKERS: Marker[] = [
  // { label: 'Standalone graphic marker', note: '', prefix: 'ternary' },
  {
    label: 'Scrollyteller opener',
    note: `If you're placing multiple scrollytellers in a single story, each must have a unique NAME.`,
    prefix: `scrollytellerNAME${MARKER_NAME}`
  },
  { label: 'Scrollyteller mark', prefix: 'mark', note: '' }
];

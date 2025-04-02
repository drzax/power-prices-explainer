import type { ResultType } from './data';

type Label = {
  id: string;
  template: string;
  orientation: 'left' | 'right' | 'middle';
};

type CustomLabel = Label & {
  type: 'custom';
  markLocation: [number, number, number];
  textLocation?: [number, number, number];
};

type ResultLabel = Label & {
  type: 'result';
  result: ResultType;
  textLocation?: [number, number, number];
};

type VisConfig = {
  title: string;
  axisLabels: (string | undefined)[];
  displayTernaryOutline: boolean;
  displayCentralZone: boolean;
  deemphasiseSectors: [boolean, boolean, boolean];
  arrows: {}[];
  yearFilters: number[];
  electorateFilters: string[];
  partyFilters: string[];
  labels: (CustomLabel | ResultLabel)[];
};

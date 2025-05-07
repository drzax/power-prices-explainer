import { parties } from './constants';
import type { ResultType } from './types';

export const getTernaryCoordinatesFromResult = (result: ResultType): [number, number, number] => [
  result.OTH,
  result.ALP,
  result.LNP
];

export const getSegmentsFromParties = () => {
  return Array.from(parties.entries()).map(([id, { gradientStops, label }]) => ({ id, gradientStops, label }));
};

export const getAllHeldBy = (data: (ResultType & { id: string })[]) =>
  data.map(d => d.PartyAb).filter((d, i, arr) => arr.indexOf(d) === i);

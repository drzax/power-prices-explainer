import { parse } from 'valibot';
import { parties } from './constants';
import type { ResultType } from './types';
import { VisConfigSchema } from './schemas';
import { decode } from '@abcnews/base-36-props';
import { visState } from './state.svelte';

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

export function toTitleCase(str: string) {
  return str
    .toLowerCase()
    .split('')
    .map((letter, i, word) =>
      i === 0 || word[i - 1] === ' ' || word[i - 1] === "'" || word[i - 1] === '-' ? letter.toUpperCase() : letter
    )
    .join('');
}

export const loadMarkerConfig = (data: string | Record<string, unknown>) => {
  const obj = typeof data === 'string' ? decode(data) : data;
  const config = parse(VisConfigSchema, obj);
  config.filters.electorate = config.filters.electorate.map(e => e.toLowerCase());
  config.highlights = config.highlights.map(d => ({ ...d, electorate: toTitleCase(d.electorate) }));
  config.timeArrows = config.timeArrows?.map(toTitleCase);
  visState.config = config;
  visState.loaded = true;
};

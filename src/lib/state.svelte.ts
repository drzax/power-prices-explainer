import { barycentric } from 'd3-ternary';
import type { VisConfigType } from './types';
import { defaultVisConfig } from './constants';
import { parse } from 'valibot';
import { decode } from '@abcnews/base-36-props';
import { VisConfigSchema } from './schemas';

export const plot = $state({ width: 100, height: 100, axisLength: 0 });
export const scale = barycentric();

let visConfig = structuredClone(defaultVisConfig);
try {
  visConfig = parse(VisConfigSchema, decode(new URL(document.location.href).searchParams.get('config') || ''));
} catch (e) {
  console.error(e, decode(new URL(document.location.href).searchParams.get('config') || ''));
}

export const visualisationConfiguration: VisConfigType = $state(visConfig);

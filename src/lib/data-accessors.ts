import { safeParse } from 'valibot';
import { decode } from '@abcnews/base-36-props';
import { visState } from './state.svelte';
import { VisualisationSchema } from './schemas';

export const loadMarkerConfig = (data: string | Record<string, unknown>) => {
  const obj = typeof data === 'string' ? decode(data) : data;

  const result = safeParse(VisualisationSchema, obj);
  if (result.success) {
    visState.config = result.output;
    visState.loaded = true;
  } else {
    console.error(result.issues);
  }
};

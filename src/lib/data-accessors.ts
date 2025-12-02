import { parse, safeParse } from 'valibot';
import { decode } from '@abcnews/base-36-props';
import { visState } from './state.svelte';
import { VisualisationSchema } from './schemas';
import configs from '../data/configs.json';

export const loadMarkerConfig = (data: string | Record<string, unknown>) => {
  let obj = typeof data === 'string' ? decode(data) : data;

  if (obj.view && typeof obj.view === 'number') {
    obj = configs[obj.view];
  }

  const result = safeParse(VisualisationSchema, obj);
  if (result.success) {
    visState.config = result.output;
    visState.loaded = true;
  } else {
    console.error(result.issues);
  }
};

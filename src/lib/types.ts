import type { InferOutput } from 'valibot';
import type { VisualisationSchema } from './schemas';

export type VisualisationType = InferOutput<typeof VisualisationSchema>;

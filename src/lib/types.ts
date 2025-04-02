import type { InferOutput } from 'valibot';
import type { ResultSchema, VisConfigSchema } from './schemas';

export type ResultType = InferOutput<typeof ResultSchema>;

export type VisConfigType = InferOutput<typeof VisConfigSchema>;

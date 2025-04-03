import type { InferOutput } from 'valibot';
import type {
  AnnotationSchema,
  CustomMarkSchema,
  HighlightSchema,
  ResultSchema,
  ShapesSchema,
  VisConfigSchema
} from './schemas';

export type ResultType = InferOutput<typeof ResultSchema>;
export type AnnotationType = InferOutput<typeof AnnotationSchema>;
export type CustomMarkType = InferOutput<typeof CustomMarkSchema>;
export type HighlightType = InferOutput<typeof HighlightSchema>;
export type VisConfigType = InferOutput<typeof VisConfigSchema>;
export type ShapesType = InferOutput<typeof ShapesSchema>;

export type PartyConstantsType = {
  label: string;
  shape: ShapesType;
  gradientStops: { offset: string; color: string }[];
};

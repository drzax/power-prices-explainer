import type { InferOutput } from 'valibot';
import type {
  AnnotationSchema,
  ArrowSchema,
  CustomMarkSchema,
  HighlightSchema,
  PartyAbbreviationSchema,
  ResultSchema,
  ShapesSchema,
  VisConfigSchema
} from './schemas';

export type ResultType = InferOutput<typeof ResultSchema>;
export type AnnotationType = InferOutput<typeof AnnotationSchema>;
export type CustomMarkType = InferOutput<typeof CustomMarkSchema>;
export type HighlightType = InferOutput<typeof HighlightSchema>;
export type ArrowType = InferOutput<typeof ArrowSchema>;
export type VisConfigType = InferOutput<typeof VisConfigSchema>;
export type ShapesType = InferOutput<typeof ShapesSchema>;
export type PartyAbbreviationType = InferOutput<typeof PartyAbbreviationSchema>;

export type PartyConstantsType = {
  label: string;
  shape: ShapesType;
  gradientStops: { offset: string; color: string }[];
};

export type Marker = {
  label: string;
  note: string;
  prefix: string;
};

import type { InferInput, InferOutput } from 'valibot';
import type {
  AnnotationSchema,
  ArrowSchema,
  DeletableSchema,
  HighlightSchema,
  SeriesSchema,
  VisualisationSchema
} from './schemas';

export type DeletableType = InferOutput<typeof DeletableSchema>;
export type VisualisationType = InferInput<typeof VisualisationSchema>;
export type AnnotationType = InferInput<typeof AnnotationSchema>;
export type ArrowType = InferOutput<typeof ArrowSchema>;
export type HighlightType = InferOutput<typeof HighlightSchema>;
export type SeriesType = InferOutput<typeof SeriesSchema>;

export enum AnnotationAnchorType {
  Top = 'TOP',
  TopRight = 'TOP_RIGHT',
  Right = 'RIGHT',
  BottomRight = 'BOTTOM_RIGHT',
  Bottom = 'BOTTOM',
  BottomLeft = 'BOTTOM_LEFT',
  Left = 'LEFT',
  TopLeft = 'TOP_LEFT',
  Middle = 'MIDDLE'
}

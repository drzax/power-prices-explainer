import { parse } from 'date-fns';
import {
  array,
  date,
  enum_,
  intersect,
  nullable,
  number,
  object,
  optional,
  picklist,
  pipe,
  string,
  transform,
  union
} from 'valibot';
import { AnnotationAnchorType } from './types';

export const DeletableSchema = object({
  deleted: optional(number())
});

export const orientations = ['left', 'right', 'above', 'below', 'middle'] as const;

export const shapes = ['circle', 'diamond', 'square'] as const;

export const DataRowSchema = object({
  date: pipe(
    string(),
    transform(d => parse(d, 'LLL-yy', new Date()))
  ),
  excl: number(),
  incl: nullable(number())
});

export const DataSchema = array(DataRowSchema);

export const ShapesSchema = picklist(shapes);

export const AnnotationAnchorSchema = enum_(AnnotationAnchorType);

export const AnnotationSchema = object({
  label: string(),
  x: union([number(), string()]),
  y: number(),
  anchor: optional(AnnotationAnchorSchema, AnnotationAnchorType.Top),
  width: optional(number(), 10) // Width in em units
});

export const ArrowSchema = object({
  from: object({
    x: union([number(), string()]),
    y: number()
  }),
  to: object({
    x: union([number(), string()]),
    y: number()
  })
});

export const HighlightSchema = object({
  tl: object({
    x: union([number(), string()]),
    y: number()
  }),
  br: object({
    x: union([number(), string()]),
    y: number()
  })
});

export const SeriesSchema = object({
  id: string(),
  series: string()
});

/**
 * Over time, the goal is to move toward following the [Vega schema](https://vega.github.io/vega/docs/). It is a minumum viable
 * interpretation for this specific visualisation with the idea that it might be used as a starting point for expansion
 * in the future. The idea is to achieve a declarative JSON schema and sent of components that renders it into a visualisation.
 * Roughly following Vega because it's a sensible and fullsome declarative spec for data vis. It might be possible to
 * more fully adopt it at some point.
 */
export const VisualisationSchema = object({
  title: string(),
  annotations: array(intersect([AnnotationSchema, DeletableSchema])),
  arrows: array(intersect([ArrowSchema, DeletableSchema])),
  highlights: array(intersect([HighlightSchema, DeletableSchema])),
  lines: array(intersect([SeriesSchema, DeletableSchema]))
});

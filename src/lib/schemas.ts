import { parse } from 'date-fns';
import {
  array,
  boolean,
  date,
  isoDate,
  isoDateTime,
  literal,
  looseObject,
  nullable,
  number,
  object,
  optional,
  picklist,
  pipe,
  string,
  transform,
  tuple,
  union,
  variant
} from 'valibot';

export const orientations = ['left', 'right', 'above', 'below', 'middle'] as const;

export const shapes = ['circle', 'diamond', 'square'] as const;

export const DataSchema = array(
  object({
    date: pipe(
      string(),
      transform(d => parse(d, 'LLL-yy', new Date()))
    ),
    excl: number(),
    incl: nullable(number())
  })
);

export const ShapesSchema = picklist(shapes);

// todo: use `variant` or similar to implement discriminated unions for mark types
const GeneralMarkProperties = object({
  x: number(),
  y: number(),
  x2: number(),
  y2: number(),
  xc: number(),
  yc: number()
});

const DataReferenceSchema = object({
  from: string(),
  field: string()
});

/**
 * This schema roughly follows the [Vega schema](https://vega.github.io/vega/docs/). It is a minumum viable
 * interpretation for this specific visualisation with the idea that it might be used as a starting point for expansion
 * in the future. The idea is to achieve a declarative JSON schema and sent of components that renders it into a visualisation.
 * Roughly following Vega because it's a sensible and fullsome declarative spec for data vis. It might be possible to
 * more fully adopt it at some point.
 */
export const VisualisationSchema = object({
  title: string(),
  annotations: array(
    object({
      label: string(),
      x: union([
        number(),
        date(),
        pipe(
          string(),
          transform(d => new Date(d))
        )
      ]),
      y: number()
    })
  ),
  arrows: array(
    object({
      from: object({
        x: union([
          number(),
          date(),
          pipe(
            string(),
            transform(d => new Date(d))
          )
        ]),
        y: number()
      }),
      to: object({
        x: union([
          number(),
          date(),
          pipe(
            string(),
            transform(d => new Date(d))
          )
        ]),
        y: number()
      })
    })
  ),
  lines: array(
    object({
      id: string(),
      series: string()
    })
  )
});

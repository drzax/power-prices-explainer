import { array, boolean, literal, number, object, optional, picklist, string, tuple, union } from 'valibot';

export const orientations = ['left', 'right', 'above', 'below', 'middle'] as const;
export const parties = ['OTH', 'LNP', 'ALP', 'TOOCLOSE', 'IN DOUBT'] as const;
export const shapes = ['circle', 'diamond', 'square'] as const;

export const ShapesSchema = picklist(shapes);

// validate the data
export const ResultSchema = object({
  id: string(),
  DivisionNm: string(),
  OTH: number(),
  ALP: number(),
  LNP: number(),
  PartyAb: picklist(parties),
  Year: number()
});

export const AnnotationSchema = object({
  text: string(),
  orientation: picklist(orientations),
  markLocation: tuple([number(), number(), number()]),
  textLocation: tuple([number(), number(), number()]),
  radius: number()
});

export const CustomMarkSchema = object({
  location: tuple([number(), number(), number()]),
  party: picklist(parties),
  label: optional(string()),
  orientation: picklist(orientations)
});

export const HighlightSchema = object({
  year: number(),
  electorate: string(),
  label: object({
    name: boolean(),
    year: boolean(),
    orientation: picklist(orientations)
  })
});

export const ArrowSchema = object({
  from: tuple([number(), number(), number()]),
  to: tuple([number(), number(), number()])
});

export const VisConfigSchema = object({
  title: string(),
  axisLabels: array(string()),
  displayTernaryOutline: boolean(),
  displaySegments: boolean(),
  displayAxes: boolean(),
  displayCentralZone: boolean(),
  resultMarkerOpacity: number(),
  deemphasiseSectors: tuple([boolean(), boolean(), boolean()]),
  arrows: array(ArrowSchema),
  filters: object({
    year: array(union([number(), literal('none')])),
    electorate: array(string()),
    party: array(string())
  }),
  highlights: array(HighlightSchema),
  marks: array(CustomMarkSchema),
  annotations: array(AnnotationSchema),
  timeArrows: optional(array(string()))
});

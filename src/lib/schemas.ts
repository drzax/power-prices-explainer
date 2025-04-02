import {
  array,
  boolean,
  intersect,
  literal,
  number,
  object,
  optional,
  parse,
  picklist,
  string,
  tuple,
  variant,
  type InferOutput
} from 'valibot';

// validate the data
export const ResultSchema = object({
  DivisionNm: string(),
  OTH: number(),
  ALP: number(),
  LNP: number(),
  PartyAb: string(),
  Year: number()
});

const orientations = ['left', 'right', 'middle'] as const;

const CustomLabelSchema = object({
  id: number(),
  type: literal('custom'),
  text: string(),
  orientation: picklist(orientations),
  markLocation: tuple([number(), number(), number()]),
  textLocation: optional(tuple([number(), number(), number()]))
});

const ResultLabelSchema = object({
  id: number(),
  type: literal('result'),
  text: string(),
  orientation: picklist(orientations),
  result: ResultSchema,
  textLocation: optional(tuple([number(), number(), number()]))
});

const LabelSchema = variant('type', [CustomLabelSchema, ResultLabelSchema]);

export const VisConfigSchema = object({
  title: string(),
  axisLabels: optional(array(string())),
  displayTernaryOutline: boolean(),
  displayCentralZone: boolean(),
  deemphasiseSectors: tuple([boolean(), boolean(), boolean()]),
  arrows: array(object({})),
  yearFilters: array(number()),
  electorateFilters: array(string()),
  partyFilters: array(string()),
  labels: array(LabelSchema)
});

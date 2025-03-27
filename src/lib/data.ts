import { array, number, object, parse, string, type InferOutput } from 'valibot';
import electorates from '../data/electorates.csv';

// validate the data
const ResultSchema = object({
  DivisionNm: string(),
  OTH: number(),
  ALP: number(),
  LNP: number(),
  PartyAb: string(),
  Year: number()
});

export type ResultType = InferOutput<typeof ResultSchema>;

export const data = parse(array(ResultSchema), electorates);

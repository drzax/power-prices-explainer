import { array, number, object, parse, string, type InferOutput } from 'valibot';
import results from '../data/electorates.csv';

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

export const data = parse(array(ResultSchema), results);

export const electorates = data.map(d => d.DivisionNm).filter((d, i, arr) => arr.indexOf(d) === i);

export const heldBy = data.map(d => d.PartyAb).filter((d, i, arr) => arr.indexOf(d) === i);

export const years = data
  .map(d => d.Year)
  .filter((d, i, arr) => arr.indexOf(d) === i)
  .sort();

const anomaly = data.filter(d => {
  return (
    (d.ALP >= 50 && d.PartyAb !== 'ALP') || (d.LNP >= 50 && d.PartyAb !== 'LNP') || (d.OTH >= 50 && d.PartyAb !== 'OTH')
  );
});

console.log('anomaly :>> ', anomaly);

import { parse } from 'valibot';
import series from '../data/data-c0JWJ.csv';
import { DataSchema } from './schemas';

export const data = parse(DataSchema, series).map(d => ({ ...d, incl: d.incl || d.excl }));

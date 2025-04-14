import { array, parse } from 'valibot';
import results from '../data/electorates2.csv';
import nationalResults from '../data/national_partyvotes_history.csv';
import { ResultSchema } from './schemas';

function capitalizeFirstLetter(str) {
  return str.split(' ').map(segment => segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase()).join(' ');
}

export const data = parse(array(ResultSchema), results)
  .map(d => ({ ...d, DivisionNm: capitalizeFirstLetter(d.DivisionNm) }))
  .map(d => ({ ...d, id: `${d.Year}-${d.DivisionNm}` }));

export const nationalData = parse(array(ResultSchema), results)
  .map(d => ({ ...d, id: d.Year }));

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

// console.log('anomaly :>> ', anomaly);

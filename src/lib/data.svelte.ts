import { array, parse } from 'valibot';

import electorates from '../data/electorates.csv';
import national from '../data/national_partyvotes_history.csv';

import { ResultSchema } from './schemas';
import { partySynonyms } from './constants';
import type { ResultType } from './types';

const rawData = parse(
  array(ResultSchema),
  electorates.map(d => ({ ...d, id: `${d.Year}-${d.DivisionNm}` }))
);

const rawDataNational = parse(
  array(ResultSchema),
  national.map(d => ({ ...d, id: `${d.Year}-${d.DivisionNm}` }))
);

export const pollsters = ['Redbridge', 'YouGov'];

export const data = $state<{ results: ResultType[] | undefined }>({
  results: undefined
});

fetch('https://www.abc.net.au/news-web/api/syndicate/storylab/elections/federal/2025')
  .then(res => res.json())
  .then(data => {
    const lnpParties = Object.entries(partySynonyms)
      .filter(([key, val]) => val === 'LNP')
      .map(([key]) => key);
    const alpParties = Object.entries(partySynonyms)
      .filter(([key, val]) => val === 'ALP')
      .map(([key]) => key);
    const electorates = data.data.electorates.map(e => {
      const ALP = e.runners.reduce((acc, curr) => {
        return alpParties.includes(curr.party.code) ? acc + parseFloat(curr.predicted.pct) : acc;
      }, 0);
      const LNP = e.runners.reduce((acc, curr) => {
        return lnpParties.includes(curr.party.code) ? acc + parseFloat(curr.predicted.pct) : acc;
      }, 0);
      const OTH = 100 - (ALP + LNP);
      const DivisionNm = e.name.toUpperCase();
      return {
        id: `$2025-${DivisionNm}`,
        DivisionNm,
        Year: 2025,
        ALP,
        LNP,
        OTH,
        PartyAb:
          e.status === 'IN DOUBT' ? 'IN DOUBT' : partySynonyms[e.leadingCandidate.party.code.toUpperCase()] || 'OTH',
        isPoll: false
      };
    });

    const votes = data.data.electorates.reduce(
      (votes, result) => {
        result.runners.forEach(runner => {
          if (alpParties.includes(runner.party.code)) {
            votes.alp += runner.predicted.votes;
          } else if (lnpParties.includes(runner.party.code)) {
            votes.lnp += runner.predicted.votes;
          } else {
            votes.oth += runner.predicted.votes;
          }
        });
        return votes;
      },
      {
        total: 0,
        informal: 0,
        alp: 0,
        lnp: 0,
        oth: 0
      }
    );

    const national = {
      id: '2025-National-Result',
      DivisionNm: 'National Result',
      Year: 2025,
      PartyAb: 'ALP',
      isPoll: false,
      ALP: (votes.alp / (votes.alp + votes.lnp + votes.oth)) * 100,
      LNP: (votes.lnp / (votes.alp + votes.lnp + votes.oth)) * 100,
      OTH: (votes.oth / (votes.alp + votes.lnp + votes.oth)) * 100
    };
    return [...electorates, national];
  })
  .then(data => parse(array(ResultSchema), data))
  .then(d => (data.results = [...d, ...rawData, ...rawDataNational]));

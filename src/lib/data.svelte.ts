import { array, parse } from 'valibot';

import results from '../data/electorates.csv';
import national from '../data/national_partyvotes_history.csv';
import nationalPolls from '../data/national_polls_primaries.csv';
import redbridgeMrpPoll from '../data/redbridge-accent-mrp-2025-04-17.csv';
import yougovMrpPoll from '../data/yougov-mrp-2025-03.csv';

import { NationalPollRawSchema, ResultSchema } from './schemas';
import { partySynonyms } from './constants';
import type { ResultType } from './types';

const rawData = parse(
  array(ResultSchema),
  results.map(d => ({ ...d, id: `${d.Year}-${d.DivisionNm}`, isPoll: false }))
);

const rawDataNational = parse(
  array(ResultSchema),
  national.map(d => ({ ...d, id: `${d.Year}-${d.DivisionNm}`, isPoll: false }))
);

const redbridgeMrpData = parse(
  array(ResultSchema),
  redbridgeMrpPoll.map(d => ({ ...d, id: `${d.Year}-${d.DivisionNm}`, isPoll: true, pollName: 'Redbridge' }))
);

const yougovMrpData = parse(
  array(ResultSchema),
  yougovMrpPoll.map(d => ({ ...d, id: `${d.Year}-${d.DivisionNm}`, isPoll: true, pollName: `YouGov` }))
);

export const nationalPollsParsed = parse(
  array(ResultSchema),
  parse(array(NationalPollRawSchema), nationalPolls).map(d => {
    const Year = d.PublicationDate.split('/').pop();
    if (!Year) {
      throw new Error('Year not found');
    }
    return {
      id: `${Year}-${d.DivisionNm}`,
      ...d,
      DivisionNm: 'National Poll',
      isPoll: true,
      pollName: d.DivisionNm,
      Year
    };
  })
);

export const pollsters = ['Redbridge', 'YouGov'];

export const data = $state<{ results: ResultType[] | undefined; polls: ResultType[] }>({
  results: undefined,
  polls: [...redbridgeMrpData, ...yougovMrpData, ...nationalPollsParsed]
});

export const years = [
  1975, 1977, 1980, 1983, 1984, 1987, 1990, 1993, 1996, 1998, 2001, 2004, 2007, 2010, 2013, 2016, 2019, 2022, 2025
];

export const electorates = [
  'ADELAIDE',
  'ASTON',
  'BALLARAT',
  'BANKS',
  'BARKER',
  'BARTON',
  'BASS',
  'BEAN',
  'BENDIGO',
  'BENNELONG',
  'BEROWRA',
  'BLAIR',
  'BLAXLAND',
  'BONNER',
  'BOOTHBY',
  'BOWMAN',
  'BRADDON',
  'BRADFIELD',
  'BRAND',
  'BRISBANE',
  'BRUCE',
  'BULLWINKEL',
  'BURT',
  'CALARE',
  'CALWELL',
  'CANBERRA',
  'CANNING',
  'CAPRICORNIA',
  'CASEY',
  'CHIFLEY',
  'CHISHOLM',
  'CLARK',
  'COOK',
  'COOPER',
  'CORANGAMITE',
  'CORIO',
  'COWAN',
  'COWPER',
  'CUNNINGHAM',
  'CURTIN',
  'DAWSON',
  'DEAKIN',
  'DICKSON',
  'DOBELL',
  'DUNKLEY',
  'DURACK',
  'EDEN-MONARO',
  'FADDEN',
  'FAIRFAX',
  'FARRER',
  'FENNER',
  'FISHER',
  'FLINDERS',
  'FLYNN',
  'FORDE',
  'FORREST',
  'FOWLER',
  'FRANKLIN',
  'FRASER',
  'FREMANTLE',
  'GELLIBRAND',
  'GILMORE',
  'GIPPSLAND',
  'GOLDSTEIN',
  'GORTON',
  'GRAYNDLER',
  'GREENWAY',
  'GREY',
  'GRIFFITH',
  'GROOM',
  'HASLUCK',
  'HAWKE',
  'HERBERT',
  'HINDMARSH',
  'HINKLER',
  'HOLT',
  'HOTHAM',
  'HUGHES',
  'HUME',
  'HUNTER',
  'INDI',
  'ISAACS',
  'JAGAJAGA',
  'KENNEDY',
  'KINGSFORD SMITH',
  'KINGSTON',
  'KOOYONG',
  'LA TROBE',
  'LALOR',
  'LEICHHARDT',
  'LILLEY',
  'LINDSAY',
  'LINGIARI',
  'LONGMAN',
  'LYNE',
  'LYONS',
  'MACARTHUR',
  'MACKELLAR',
  'MACNAMARA',
  'MACQUARIE',
  'MAKIN',
  'MALLEE',
  'MARANOA',
  'MARIBYRNONG',
  'MAYO',
  'MCEWEN',
  'MCMAHON',
  'MCPHERSON',
  'MELBOURNE',
  'MENZIES',
  'MITCHELL',
  'MONASH',
  'MONCRIEFF',
  'MOORE',
  'MORETON',
  'NEW ENGLAND',
  'NEWCASTLE',
  'NICHOLLS',
  "O'CONNOR",
  'OXLEY',
  'PAGE',
  'PARKES',
  'PARRAMATTA',
  'PATERSON',
  'PEARCE',
  'PERTH',
  'PETRIE',
  'RANKIN',
  'REID',
  'RICHMOND',
  'RIVERINA',
  'ROBERTSON',
  'RYAN',
  'SCULLIN',
  'SHORTLAND',
  'SOLOMON',
  'SPENCE',
  'STURT',
  'SWAN',
  'SYDNEY',
  'TANGNEY',
  'WANNON',
  'WARRINGAH',
  'WATSON',
  'WENTWORTH',
  'WERRIWA',
  'WHITLAM',
  'WIDE BAY',
  'WILLS',
  'WRIGHT',
  'BATMAN',
  'CHARLTON',
  'DENISON',
  'GWYDIR',
  'HIGGINS',
  'KALGOORLIE',
  'LOWE',
  'MCMILLAN',
  'MELBOURNE PORTS',
  'MURRAY',
  'NORTH SYDNEY',
  'PORT ADELAIDE',
  'PROSPECT',
  'STIRLING',
  'THROSBY',
  'WAKEFIELD',
  'BONYTHON',
  'BURKE',
  'NORTHERN TERRITORY',
  'NAMADGI',
  'CORINELLA',
  'ANGAS',
  'BALACLAVA',
  'BALLAARAT',
  'DARLING',
  'DARLING DOWNS',
  'DIAMOND VALLEY',
  'DUNDAS',
  'EVANS',
  'HAWKER',
  'HENTY',
  'LANG',
  'PHILLIP',
  'RIVERINA-DARLING',
  'ST GEORGE',
  'STREETON',
  'WILMOT',
  'WIMMERA'
];

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

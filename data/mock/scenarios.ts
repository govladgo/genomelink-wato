import { WATOMatch } from '../types';

/**
 * Pre-built WATO scenarios — one per common adoptee/NPE/genealogy use case.
 * Each scenario has a target match and 2–3 competing hypotheses to test.
 */
export const mockScenarios: WATOMatch[] = [
  {
    id: 'scenario-adoptee',
    name: 'David — possible biological grandparent',
    sharedCM: 1820,
    notes: 'Adoptee searching for biological family. This match is a strong candidate for grandparent or close relative.',
    hypotheses: [
      {
        id: 'h-grandparent',
        label: 'Biological grandparent',
        mySideGenerations: 2,
        matchSideGenerations: 0,
        notes: 'David IS my biological grandfather (direct ancestor).',
      },
      {
        id: 'h-uncle',
        label: 'Biological uncle / aunt',
        mySideGenerations: 1,
        matchSideGenerations: 2,
        notes: 'David is a sibling of my biological parent.',
      },
      {
        id: 'h-sibling',
        label: 'Full sibling',
        mySideGenerations: 1,
        matchSideGenerations: 1,
        notes: 'We share both biological parents.',
      },
      {
        id: 'h-1stcousin',
        label: '1st cousin',
        mySideGenerations: 2,
        matchSideGenerations: 2,
        notes: 'Shared grandparents.',
      },
    ],
  },
  {
    id: 'scenario-npe',
    name: 'Margaret — NPE confirmation',
    sharedCM: 387,
    notes: 'Testing whether a "1st cousin" by family lore is actually a half-sibling (NPE — non-paternal event).',
    hypotheses: [
      {
        id: 'h-1c1r',
        label: 'Family-lore: 1st cousin once removed',
        mySideGenerations: 3,
        matchSideGenerations: 2,
        notes: 'My mother\'s 1st cousin\'s daughter, per family records.',
      },
      {
        id: 'h-half-1c',
        label: 'Half 1st cousin (suggested NPE)',
        mySideGenerations: 2,
        matchSideGenerations: 2,
        notes: 'Half siblings of our parents → half 1st cousins.',
      },
      {
        id: 'h-2c',
        label: '2nd cousin (alternative)',
        mySideGenerations: 3,
        matchSideGenerations: 3,
        notes: 'Shared great-grandparents.',
      },
    ],
  },
  {
    id: 'scenario-distant',
    name: 'Eleanor — distant cousin placement',
    sharedCM: 67,
    notes: 'Distant match suspected to be a 4th cousin or 3rd cousin once removed. Testing both.',
    hypotheses: [
      {
        id: 'h-3c1r',
        label: '3rd cousin once removed',
        mySideGenerations: 4,
        matchSideGenerations: 5,
        notes: 'Through my paternal great-great-grandfather\'s line.',
      },
      {
        id: 'h-4c',
        label: '4th cousin',
        mySideGenerations: 5,
        matchSideGenerations: 5,
        notes: 'Shared 3x-great-grandparents.',
      },
      {
        id: 'h-2c2r',
        label: '2nd cousin twice removed',
        mySideGenerations: 5,
        matchSideGenerations: 3,
        notes: 'Match is 2 generations older than my reference frame.',
      },
    ],
  },
];

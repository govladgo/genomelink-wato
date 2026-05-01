import { SharedCmEntryV4 } from './cmTypes';

/** Generate a 10-bucket histogram simulating a normal distribution for a relationship. */
function generateHistogram(minCM: number, maxCM: number, avgCM: number): number[] {
  const buckets = 10;
  const range = maxCM - minCM || 1;
  const sigma = range / 4;
  const hist: number[] = [];
  let total = 0;

  for (let i = 0; i < buckets; i++) {
    const bucketCenter = minCM + (range * (i + 0.5)) / buckets;
    const z = (bucketCenter - avgCM) / sigma;
    const val = Math.exp(-0.5 * z * z);
    hist.push(val);
    total += val;
  }

  // Normalize so max bucket = 1
  const maxVal = Math.max(...hist);
  return hist.map((v) => (maxVal > 0 ? v / maxVal : 0));
}

/** Normal PDF approximation for probability calculation. */
function normalPdf(x: number, mean: number, sigma: number): number {
  const z = (x - mean) / sigma;
  return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI));
}

interface RawEntry {
  relationship: string;
  minCM: number;
  maxCM: number;
  avgCM: number;
  category: 'close' | 'moderate' | 'distant' | 'very-distant';
  generationGap: number;
}

const rawData: RawEntry[] = [
  { relationship: 'Identical twin', minCM: 3400, maxCM: 3600, avgCM: 3500, category: 'close', generationGap: 0 },
  { relationship: 'Parent / Child', minCM: 3330, maxCM: 3720, avgCM: 3485, category: 'close', generationGap: 1 },
  { relationship: 'Full sibling', minCM: 2209, maxCM: 3384, avgCM: 2613, category: 'close', generationGap: 0 },
  { relationship: 'Grandparent / Grandchild', minCM: 1156, maxCM: 2311, avgCM: 1766, category: 'close', generationGap: 2 },
  { relationship: 'Uncle / Aunt', minCM: 1201, maxCM: 2282, avgCM: 1741, category: 'close', generationGap: 2 },
  { relationship: 'Half sibling', minCM: 1160, maxCM: 2436, avgCM: 1759, category: 'close', generationGap: 1 },
  { relationship: 'Great-grandparent', minCM: 485, maxCM: 1486, avgCM: 887, category: 'moderate', generationGap: 3 },
  { relationship: '1st cousin', minCM: 553, maxCM: 1225, avgCM: 866, category: 'moderate', generationGap: 2 },
  { relationship: 'Great-uncle / Aunt', minCM: 251, maxCM: 1172, avgCM: 712, category: 'moderate', generationGap: 3 },
  { relationship: 'Half uncle / Aunt', minCM: 500, maxCM: 1446, avgCM: 880, category: 'moderate', generationGap: 2 },
  { relationship: '1st cousin once removed', minCM: 220, maxCM: 871, avgCM: 433, category: 'moderate', generationGap: 3 },
  { relationship: 'Half 1st cousin', minCM: 137, maxCM: 856, avgCM: 449, category: 'moderate', generationGap: 3 },
  { relationship: 'Great-great-grandparent', minCM: 190, maxCM: 850, avgCM: 444, category: 'moderate', generationGap: 4 },
  { relationship: '1st cousin twice removed', minCM: 43, maxCM: 531, avgCM: 221, category: 'distant', generationGap: 4 },
  { relationship: '2nd cousin', minCM: 41, maxCM: 592, avgCM: 229, category: 'distant', generationGap: 4 },
  { relationship: 'Half 1st cousin once removed', minCM: 57, maxCM: 530, avgCM: 224, category: 'distant', generationGap: 4 },
  { relationship: '2nd cousin once removed', minCM: 0, maxCM: 325, avgCM: 122, category: 'distant', generationGap: 5 },
  { relationship: 'Half 2nd cousin', minCM: 9, maxCM: 397, avgCM: 118, category: 'distant', generationGap: 5 },
  { relationship: '3rd cousin', minCM: 0, maxCM: 234, avgCM: 73, category: 'distant', generationGap: 6 },
  { relationship: '2nd cousin twice removed', minCM: 0, maxCM: 269, avgCM: 71, category: 'distant', generationGap: 6 },
  { relationship: 'Half 2nd cousin once removed', minCM: 0, maxCM: 223, avgCM: 60, category: 'distant', generationGap: 6 },
  { relationship: '3rd cousin once removed', minCM: 0, maxCM: 192, avgCM: 48, category: 'very-distant', generationGap: 7 },
  { relationship: 'Half 3rd cousin', minCM: 0, maxCM: 173, avgCM: 41, category: 'very-distant', generationGap: 7 },
  { relationship: '4th cousin', minCM: 0, maxCM: 139, avgCM: 35, category: 'very-distant', generationGap: 8 },
  { relationship: '3rd cousin twice removed', minCM: 0, maxCM: 165, avgCM: 33, category: 'very-distant', generationGap: 8 },
  { relationship: 'Half 3rd cousin once removed', minCM: 0, maxCM: 130, avgCM: 26, category: 'very-distant', generationGap: 8 },
  { relationship: '4th cousin once removed', minCM: 0, maxCM: 126, avgCM: 24, category: 'very-distant', generationGap: 9 },
  { relationship: 'Half 4th cousin', minCM: 0, maxCM: 100, avgCM: 19, category: 'very-distant', generationGap: 9 },
  { relationship: '5th cousin', minCM: 0, maxCM: 117, avgCM: 18, category: 'very-distant', generationGap: 10 },
  { relationship: '5th cousin once removed', minCM: 0, maxCM: 99, avgCM: 13, category: 'very-distant', generationGap: 10 },
  { relationship: '6th cousin', minCM: 0, maxCM: 84, avgCM: 11, category: 'very-distant', generationGap: 12 },
  { relationship: '6th cousin once removed', minCM: 0, maxCM: 73, avgCM: 8, category: 'very-distant', generationGap: 13 },
  { relationship: '7th cousin', minCM: 0, maxCM: 50, avgCM: 6, category: 'very-distant', generationGap: 14 },
  { relationship: '8th cousin', minCM: 0, maxCM: 30, avgCM: 4, category: 'very-distant', generationGap: 16 },
];

/** Pre-built entries with histograms. */
const allEntries: SharedCmEntryV4[] = rawData.map((r) => ({
  ...r,
  probability: 0,
  histogram: generateHistogram(r.minCM, r.maxCM, r.avgCM),
}));

/**
 * Return relationship probabilities for a given cM value.
 * @param cM - Shared centiMorgan value
 * @param endogamyFactor - Endogamy adjustment (default 1.0). Values > 1 mean
 *   the actual relationship is more distant than cM suggests.
 */
export function getRelationshipsForCM(
  cM: number,
  endogamyFactor: number = 1.0,
): SharedCmEntryV4[] {
  const adjustedCM = cM / endogamyFactor;

  // Filter entries where adjustedCM falls within range (with 10% tolerance for edge)
  const matched = allEntries
    .filter((e) => {
      const tolerance = (e.maxCM - e.minCM) * 0.05;
      return adjustedCM >= e.minCM - tolerance && adjustedCM <= e.maxCM + tolerance;
    })
    .map((e) => {
      const range = e.maxCM - e.minCM || 1;
      const sigma = range / 4;
      const prob = normalPdf(adjustedCM, e.avgCM, sigma);
      return { ...e, probability: prob };
    });

  // Normalize probabilities to sum to 1
  const totalProb = matched.reduce((sum, e) => sum + e.probability, 0);
  if (totalProb > 0) {
    matched.forEach((e) => {
      e.probability = e.probability / totalProb;
    });
  }

  // Sort descending by probability
  matched.sort((a, b) => b.probability - a.probability);

  return matched;
}

export { allEntries };

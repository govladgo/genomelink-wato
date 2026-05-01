export interface SharedCmEntry {
  relationship: string;
  minCM: number;
  maxCM: number;
  avgCM: number;
  probability: number;
}

export interface SharedCmEntryV4 {
  relationship: string;
  minCM: number;
  maxCM: number;
  avgCM: number;
  probability: number;
  histogram: number[];
  category: 'close' | 'moderate' | 'distant' | 'very-distant';
  generationGap: number;
}

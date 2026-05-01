export interface Segment {
  chromosome: number;
  startBp: number;
  endBp: number;
  cM: number;
  snps: number;
  isTriangulated: boolean;
  clusterId?: number;
}

export interface DNAMatch {
  id: string;
  name: string;
  sharedCM: number;
  sharedPercentage: number;
  relationship: string;
  source: '23andme' | 'myheritage' | 'ftdna' | 'gedmatch' | 'ancestry' | 'manual' | 'other';
  profileType: 'open' | 'limited';
  isNew: boolean;
  segments: Segment[];
  tags: string[];
  avatarColor: string;
  initials: string;
  birthYear?: string;
  location?: string;
  treeUrl?: string;
  lineage?: 'paternal' | 'maternal' | 'unassigned';
  sharedSurnames?: string[];
  ancestryComposition?: AncestryComponent[];
  endogamyScore?: number;
  sharedTraits?: number;
  dissimilarTraits?: number;
}

export interface AncestryComponent {
  region: string;
  percentage: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export type CitationSource =
  | 'cm' | 'segments' | 'cluster' | 'lineage'
  | 'surnames' | 'ancestry' | 'endogamy' | 'traits' | 'source';

export interface Citation {
  source: CitationSource;
  value: string;
}

// ---------------------------------------------------------------------------
// WATO-specific types
// ---------------------------------------------------------------------------

/**
 * A single hypothesis: "the match shares a most-recent-common-ancestor (MRCA)
 * with me, and we're each N generations down from that MRCA on our respective sides."
 */
export interface Hypothesis {
  id: string;
  /** Human-readable label, e.g. "Through paternal grandfather" */
  label: string;
  /** Generations from YOU to the MRCA (e.g. 2 = grandparent) */
  mySideGenerations: number;
  /** Generations from MATCH to the MRCA */
  matchSideGenerations: number;
  /** Optional notes about the hypothesis */
  notes?: string;
}

export interface HypothesisResult {
  hypothesis: Hypothesis;
  /** Predicted relationship label, e.g. "2nd cousin once removed" */
  predictedRelationship: string;
  /** Expected average cM for this relationship */
  expectedCM: number;
  /** Range of plausible cM */
  cmRange: [number, number];
  /** Probability that the actual cM is consistent with this hypothesis (0–1) */
  probability: number;
  /** Probability normalized across all hypotheses for this match */
  normalizedProbability: number;
  /** "high" if 70%+, "medium" if 30-70%, "low" otherwise */
  confidence: 'high' | 'medium' | 'low' | 'impossible';
  /** Why probability is low/impossible (if applicable) */
  reasoning: string;
}

export interface WATOMatch {
  id: string;
  name: string;
  sharedCM: number;
  /** User-defined hypotheses to test */
  hypotheses: Hypothesis[];
  notes?: string;
}

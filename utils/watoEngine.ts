/**
 * WATO ("What Are The Odds?") hypothesis-testing engine.
 *
 * Given a hypothesis ("MRCA is N generations on my side, M on the match's side"),
 * compute:
 *   1. The implied relationship label (e.g. "2nd cousin once removed")
 *   2. The expected cM range and average for that relationship
 *   3. The probability the actual cM is consistent with that relationship
 *   4. A confidence label (high/medium/low/impossible)
 *
 * Pure functions only. ES5-compat (no for...of on iterators).
 */

import { Hypothesis, HypothesisResult } from '@/data/types';
import { allEntries } from '@/data/sharedCmData';
import { SharedCmEntryV4 } from '@/data/cmTypes';

// ---------------------------------------------------------------------------
// Relationship label derivation
// ---------------------------------------------------------------------------

/**
 * Map (mySideGen, matchSideGen) → relationship label.
 *
 * Convention:
 *   mySideGen=0 means MRCA is YOU (impossible — match would be a descendant of you)
 *   mySideGen=1 means MRCA is your parent → match is your sibling/half-sibling/etc
 *   mySideGen=2 means MRCA is your grandparent → match is your aunt/cousin/etc
 *   mySideGen=3 means MRCA is your great-grandparent → match is your 1st-cousin-once-removed/2nd cousin/etc
 *
 * For symmetric placements (mySideGen === matchSideGen), the result is "Nth cousin"
 * For asymmetric placements, the result is "Nth cousin K-times removed"
 */
export function deriveRelationship(
  mySideGen: number,
  matchSideGen: number
): string {
  if (mySideGen < 0 || matchSideGen < 0) return 'invalid';
  if (mySideGen === 0 && matchSideGen === 0) return 'invalid';

  // Direct ancestor / descendant line — one of you IS the MRCA
  if (matchSideGen === 0 || mySideGen === 0) {
    const distance = mySideGen + matchSideGen;
    if (distance === 1) return 'Parent / Child';
    if (distance === 2) return 'Grandparent / Grandchild';
    if (distance === 3) return 'Great-grandparent';
    if (distance === 4) return 'Great-great-grandparent';
    return 'unknown';
  }

  const minGen = Math.min(mySideGen, matchSideGen);
  const removed = Math.abs(mySideGen - matchSideGen);

  // mySideGen=1, matchSideGen=1 → siblings (MRCA is parent of both)
  if (mySideGen === 1 && matchSideGen === 1) return 'Full sibling';

  // mySideGen=1, matchSideGen=2 → uncle/aunt or niece/nephew (MRCA is grandparent of one)
  if (minGen === 1 && removed === 1) return 'Uncle / Aunt';
  if (minGen === 1 && removed === 2) return 'Great-uncle / Aunt';
  if (minGen === 1 && removed === 3) return 'Great-great-uncle / Aunt';

  // Cousin relationships: minGen >= 2
  if (minGen >= 2) {
    const cousinDegree = minGen - 1;

    if (removed === 0) {
      // Symmetric → "Nth cousin"
      const labels = ['', '1st cousin', '2nd cousin', '3rd cousin', '4th cousin', '5th cousin', '6th cousin', '7th cousin', '8th cousin'];
      return labels[cousinDegree] || `${cousinDegree}th cousin`;
    } else {
      // "Nth cousin K times removed"
      const cousinLabels = ['', '1st cousin', '2nd cousin', '3rd cousin', '4th cousin', '5th cousin', '6th cousin'];
      const removedLabels = ['', 'once removed', 'twice removed', 'three times removed', 'four times removed'];
      const baseLabel = cousinLabels[cousinDegree] || `${cousinDegree}th cousin`;
      const removedLabel = removedLabels[removed] || `${removed} times removed`;
      return `${baseLabel} ${removedLabel}`;
    }
  }

  return 'unknown';
}

// ---------------------------------------------------------------------------
// Find the matching SharedCmEntryV4 for a relationship label
// ---------------------------------------------------------------------------

function findEntry(relationship: string): SharedCmEntryV4 | null {
  // Exact match first
  for (let i = 0; i < allEntries.length; i++) {
    if (allEntries[i].relationship === relationship) return allEntries[i];
  }
  // Loose match (e.g., "1st cousin once removed" vs "1st cousin once removed")
  const lower = relationship.toLowerCase();
  for (let i = 0; i < allEntries.length; i++) {
    if (allEntries[i].relationship.toLowerCase() === lower) return allEntries[i];
  }
  return null;
}

// ---------------------------------------------------------------------------
// Probability calculation
// ---------------------------------------------------------------------------

/** Normal PDF approximation. */
function normalPdf(x: number, mean: number, sigma: number): number {
  const z = (x - mean) / sigma;
  return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI));
}

/**
 * Score a single hypothesis against an observed cM value.
 * Returns probability density at the observed cM under the predicted relationship's distribution.
 */
function scoreHypothesis(
  observedCM: number,
  entry: SharedCmEntryV4,
  endogamyFactor: number
): number {
  // Endogamy inflates cM, so divide observed cM by the factor before comparing
  const adjustedCM = observedCM / endogamyFactor;
  const range = entry.maxCM - entry.minCM || 1;
  const sigma = range / 4;
  return normalPdf(adjustedCM, entry.avgCM, sigma);
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

type Confidence = 'high' | 'medium' | 'low' | 'impossible';
interface IntermediateResult {
  hypothesis: Hypothesis;
  predictedRelationship: string;
  expectedCM: number;
  cmRange: [number, number];
  rawProb: number;
  probability: number;
  normalizedProbability: number;
  confidence: Confidence;
  reasoning: string;
}

export function evaluateHypotheses(
  observedCM: number,
  hypotheses: Hypothesis[],
  endogamyFactor: number = 1.0
): HypothesisResult[] {
  // Score each hypothesis individually
  const intermediate: IntermediateResult[] = hypotheses.map(h => {
    const relationship = deriveRelationship(h.mySideGenerations, h.matchSideGenerations);
    const entry = findEntry(relationship);

    if (!entry) {
      return {
        hypothesis: h,
        predictedRelationship: relationship,
        expectedCM: 0,
        cmRange: [0, 0] as [number, number],
        rawProb: 0,
        probability: 0,
        normalizedProbability: 0,
        confidence: 'impossible' as const,
        reasoning: relationship === 'invalid'
          ? 'Hypothesis requires at least 1 generation on each side.'
          : `No reference data for ${relationship}.`,
      };
    }

    const adjustedCM = observedCM / endogamyFactor;
    const tolerance = (entry.maxCM - entry.minCM) * 0.1;
    const inRange = adjustedCM >= entry.minCM - tolerance && adjustedCM <= entry.maxCM + tolerance;

    let reasoning = '';
    let confidence: 'high' | 'medium' | 'low' | 'impossible';
    if (!inRange) {
      reasoning = `Observed ${observedCM.toFixed(0)} cM is outside the typical range for ${relationship} (${entry.minCM}–${entry.maxCM} cM).`;
      confidence = 'impossible';
    } else if (Math.abs(adjustedCM - entry.avgCM) < (entry.maxCM - entry.minCM) * 0.15) {
      reasoning = `${observedCM.toFixed(0)} cM is very close to the average for ${relationship} (${entry.avgCM} cM).`;
      confidence = 'high';
    } else {
      reasoning = `${observedCM.toFixed(0)} cM is within the plausible range for ${relationship}.`;
      confidence = 'medium';
    }

    const rawProb = inRange ? scoreHypothesis(observedCM, entry, endogamyFactor) : 0;

    return {
      hypothesis: h,
      predictedRelationship: relationship,
      expectedCM: entry.avgCM,
      cmRange: [entry.minCM, entry.maxCM] as [number, number],
      rawProb,
      probability: rawProb,
      normalizedProbability: 0,
      confidence,
      reasoning,
    };
  });

  // Normalize probabilities across hypotheses
  const totalProb = intermediate.reduce((sum, r) => sum + r.rawProb, 0);
  for (let i = 0; i < intermediate.length; i++) {
    intermediate[i].normalizedProbability = totalProb > 0 ? intermediate[i].rawProb / totalProb : 0;

    // Re-bucket confidence based on NORMALIZED probability
    const np = intermediate[i].normalizedProbability;
    if (intermediate[i].confidence !== 'impossible') {
      let updated: 'high' | 'medium' | 'low';
      if (np >= 0.6) updated = 'high';
      else if (np >= 0.25) updated = 'medium';
      else updated = 'low';
      intermediate[i].confidence = updated;
    }
  }

  // Sort by normalized probability descending
  intermediate.sort((a, b) => b.normalizedProbability - a.normalizedProbability);

  // Strip rawProb from the public return type
  return intermediate.map(r => ({
    hypothesis: r.hypothesis,
    predictedRelationship: r.predictedRelationship,
    expectedCM: r.expectedCM,
    cmRange: r.cmRange,
    probability: r.probability,
    normalizedProbability: r.normalizedProbability,
    confidence: r.confidence,
    reasoning: r.reasoning,
  }));
}

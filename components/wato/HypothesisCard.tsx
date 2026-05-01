'use client';
import { useState } from 'react';
import { HypothesisResult } from '@/data/types';
import { ProbabilityBar } from './ProbabilityBar';

interface HypothesisCardProps {
  result: HypothesisResult;
  rank: number;
  onEdit: (id: string, updates: { label?: string; mySideGenerations?: number; matchSideGenerations?: number; notes?: string }) => void;
  onDelete: (id: string) => void;
}

export function HypothesisCard({ result, rank, onEdit, onDelete }: HypothesisCardProps) {
  const [editing, setEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(result.hypothesis.label);
  const [editMySide, setEditMySide] = useState(result.hypothesis.mySideGenerations);
  const [editMatchSide, setEditMatchSide] = useState(result.hypothesis.matchSideGenerations);

  const isLeader = rank === 0 && result.confidence !== 'impossible';
  const isImpossible = result.confidence === 'impossible';

  const handleSave = () => {
    onEdit(result.hypothesis.id, {
      label: editLabel,
      mySideGenerations: editMySide,
      matchSideGenerations: editMatchSide,
    });
    setEditing(false);
  };

  return (
    <div style={{
      padding: 16,
      borderRadius: 10,
      background: 'var(--gl-color-surface)',
      border: isLeader
        ? '2px solid var(--gl-color-positive)'
        : isImpossible
          ? '1px solid var(--gl-color-gray-200)'
          : '1px solid var(--gl-color-border-light)',
      opacity: isImpossible ? 0.6 : 1,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 10,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {editing ? (
            <input
              type="text"
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              className="gl-input"
              style={{ width: '100%', fontSize: 14, fontWeight: 600 }}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {isLeader && (
                <span style={{
                  padding: '1px 8px', borderRadius: 4,
                  background: 'var(--gl-color-positive)', color: '#fff',
                  fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                }}>
                  Best fit
                </span>
              )}
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--gl-color-primary-dark)' }}>
                {result.hypothesis.label}
              </span>
            </div>
          )}
          <div style={{ fontSize: 12, color: 'var(--gl-color-text-muted)', marginTop: 4 }}>
            Predicted: <strong>{result.predictedRelationship}</strong>
            {result.expectedCM > 0 && ` · ~${Math.round(result.expectedCM)} cM avg (${Math.round(result.cmRange[0])}–${Math.round(result.cmRange[1])} cM range)`}
          </div>
        </div>
        <ProbabilityBar result={result} />
      </div>

      {/* Generations input */}
      {editing ? (
        <div style={{ display: 'flex', gap: 16, marginBottom: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={genLabel}>Generations on YOUR side</div>
            <input
              type="number"
              min={1}
              max={10}
              value={editMySide}
              onChange={(e) => setEditMySide(Math.max(1, parseInt(e.target.value) || 1))}
              className="gl-input"
              style={{ width: '100%' }}
            />
            <div style={genHint}>1 = parent, 2 = grandparent, 3 = great-grandparent</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={genLabel}>Generations on MATCH side</div>
            <input
              type="number"
              min={1}
              max={10}
              value={editMatchSide}
              onChange={(e) => setEditMatchSide(Math.max(1, parseInt(e.target.value) || 1))}
              className="gl-input"
              style={{ width: '100%' }}
            />
            <div style={genHint}>How many generations from the MRCA down to the match.</div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
          <div style={genChip}>
            <span style={genChipLabel}>You</span>
            <span style={genChipValue}>{result.hypothesis.mySideGenerations}g</span>
          </div>
          <div style={genChip}>
            <span style={genChipLabel}>Match</span>
            <span style={genChipValue}>{result.hypothesis.matchSideGenerations}g</span>
          </div>
        </div>
      )}

      {/* Reasoning */}
      <p style={{
        fontSize: 12,
        color: 'var(--gl-color-text-secondary)',
        lineHeight: 1.5,
        margin: '4px 0 0',
      }}>
        {result.reasoning}
      </p>

      {result.hypothesis.notes && !editing && (
        <p style={{
          fontSize: 11,
          color: 'var(--gl-color-text-muted)',
          fontStyle: 'italic',
          margin: '6px 0 0',
        }}>
          {result.hypothesis.notes}
        </p>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        {editing ? (
          <>
            <button onClick={handleSave} className="gl-btn gl-btn--primary" style={btnSm}>
              Save
            </button>
            <button onClick={() => setEditing(false)} className="gl-btn gl-btn--secondary" style={btnSm}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setEditing(true)} className="gl-btn gl-btn--secondary" style={btnSm}>
              Edit
            </button>
            <button onClick={() => onDelete(result.hypothesis.id)} className="gl-btn gl-btn--secondary" style={btnSm}>
              Remove
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const genLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--gl-color-text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  marginBottom: 4,
};
const genHint: React.CSSProperties = {
  fontSize: 10,
  color: 'var(--gl-color-text-muted)',
  marginTop: 4,
};
const genChip: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '4px 10px',
  borderRadius: 6,
  background: 'var(--gl-color-bg)',
  fontSize: 11,
};
const genChipLabel: React.CSSProperties = {
  fontWeight: 600,
  color: 'var(--gl-color-text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};
const genChipValue: React.CSSProperties = {
  fontWeight: 700,
  color: 'var(--gl-color-primary-dark)',
};
const btnSm: React.CSSProperties = {
  padding: '5px 10px',
  fontSize: 11,
};

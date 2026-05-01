import { HypothesisResult } from '@/data/types';

interface ProbabilityBarProps {
  result: HypothesisResult;
  showLabel?: boolean;
}

export function ProbabilityBar({ result, showLabel = true }: ProbabilityBarProps) {
  const pct = Math.round(result.normalizedProbability * 100);
  const fillColor =
    result.confidence === 'high' ? 'var(--gl-color-positive)' :
    result.confidence === 'medium' ? '#FFB300' :
    result.confidence === 'low' ? 'var(--gl-color-text-muted)' :
    'var(--gl-color-red)';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 140 }}>
      <div style={{
        flex: 1,
        height: 8,
        borderRadius: 4,
        background: 'var(--gl-color-gray-200)',
        overflow: 'hidden',
      }}>
        <div
          style={{
            height: '100%',
            borderRadius: 4,
            width: `${Math.min(pct, 100)}%`,
            background: fillColor,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      {showLabel && (
        <span style={{
          fontSize: 13, fontWeight: 700,
          color: fillColor,
          minWidth: 42, textAlign: 'right',
        }}>
          {result.confidence === 'impossible' ? '0%' : `${pct}%`}
        </span>
      )}
    </div>
  );
}

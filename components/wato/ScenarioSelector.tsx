import { WATOMatch } from '@/data/types';

interface ScenarioSelectorProps {
  scenarios: WATOMatch[];
  activeId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
}

export function ScenarioSelector({ scenarios, activeId, onSelect, onNew }: ScenarioSelectorProps) {
  return (
    <aside style={{
      background: 'var(--gl-color-surface)',
      borderRadius: 12,
      padding: 12,
      boxShadow: 'var(--gl-shadow-sm)',
      height: 'fit-content',
    }}>
      <div style={{
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--gl-color-text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        margin: '4px 8px 8px',
      }}>
        Scenarios
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {scenarios.map(s => {
          const isActive = s.id === activeId;
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              style={{
                textAlign: 'left',
                padding: '8px 10px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                background: isActive ? 'rgba(38, 56, 86, 0.08)' : 'transparent',
                transition: 'all 0.15s',
              }}
            >
              <div style={{
                fontSize: 13,
                fontWeight: isActive ? 600 : 500,
                color: 'var(--gl-color-primary-dark)',
                marginBottom: 2,
              }}>
                {s.name.split('—')[0].trim()}
              </div>
              <div style={{ fontSize: 10, color: 'var(--gl-color-text-muted)' }}>
                {s.sharedCM} cM · {s.hypotheses.length} {s.hypotheses.length === 1 ? 'hypothesis' : 'hypotheses'}
              </div>
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--gl-color-border-light)' }}>
        <button
          onClick={onNew}
          style={{
            width: '100%',
            padding: '8px 10px',
            background: 'transparent',
            border: '1px dashed var(--gl-color-border-light)',
            borderRadius: 8,
            color: 'var(--gl-color-text-muted)',
            fontSize: 12,
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          + New scenario
        </button>
      </div>
    </aside>
  );
}

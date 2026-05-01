interface EndogamySliderProps {
  value: number;
  onChange: (value: number) => void;
}

const PRESETS = [
  { label: 'None', value: 1.0, description: 'No endogamy adjustment' },
  { label: 'Low', value: 1.1, description: 'Mild population mixing (e.g., regional)' },
  { label: 'Moderate', value: 1.25, description: 'Notable shared ancestry (e.g., Acadian, colonial American)' },
  { label: 'High', value: 1.5, description: 'Strong endogamy (e.g., Ashkenazi Jewish, Mennonite)' },
  { label: 'Very high', value: 1.75, description: 'Extreme endogamy (isolated populations)' },
];

export function EndogamySlider({ value, onChange }: EndogamySliderProps) {
  return (
    <div style={{
      padding: '14px 16px',
      borderRadius: 10,
      background: 'var(--gl-color-surface)',
      boxShadow: 'var(--gl-shadow-sm)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gl-color-primary-dark)' }}>
            Endogamy adjustment
          </div>
          <div style={{ fontSize: 11, color: 'var(--gl-color-text-muted)', marginTop: 2 }}>
            Endogamous populations show inflated cM. Adjust to get a more accurate relationship estimate.
          </div>
        </div>
        <span style={{
          fontSize: 14, fontWeight: 700,
          color: value > 1 ? 'var(--gl-color-primary-attention)' : 'var(--gl-color-text-muted)',
          minWidth: 50, textAlign: 'right',
        }}>
          ×{value.toFixed(2)}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {PRESETS.map(p => {
          const isActive = Math.abs(p.value - value) < 0.001;
          return (
            <button
              key={p.value}
              onClick={() => onChange(p.value)}
              title={p.description}
              style={{
                padding: '5px 12px',
                fontSize: 11,
                fontWeight: 600,
                borderRadius: 6,
                cursor: 'pointer',
                border: isActive ? '1px solid var(--gl-color-primary-dark)' : '1px solid var(--gl-color-border-light)',
                background: isActive ? 'var(--gl-color-primary-dark)' : 'transparent',
                color: isActive ? '#fff' : 'var(--gl-color-text-secondary)',
                transition: 'all 0.15s',
              }}
            >
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

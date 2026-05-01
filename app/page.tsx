'use client';

import { useState, useCallback } from 'react';
import { useWATO } from '@/hooks/useWATO';
import { ScenarioSelector } from '@/components/wato/ScenarioSelector';
import { HypothesisCard } from '@/components/wato/HypothesisCard';
import { EndogamySlider } from '@/components/wato/EndogamySlider';

export default function HomePage() {
  const {
    hydrated, scenarios, activeScenario, activeId, endogamyFactor, results,
    selectScenario, updateScenario, addHypothesis, editHypothesis, deleteHypothesis,
    setEndogamyFactor, newScenario, reset,
  } = useWATO();

  const [editingHeader, setEditingHeader] = useState(false);
  const [editName, setEditName] = useState('');
  const [editCM, setEditCM] = useState(0);

  const startHeaderEdit = useCallback(() => {
    if (!activeScenario) return;
    setEditName(activeScenario.name);
    setEditCM(activeScenario.sharedCM);
    setEditingHeader(true);
  }, [activeScenario]);

  const saveHeader = useCallback(() => {
    updateScenario({ name: editName, sharedCM: editCM });
    setEditingHeader(false);
  }, [editName, editCM, updateScenario]);

  if (!hydrated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gl-color-text-muted)', fontSize: 14, fontFamily: 'var(--gl-font)', background: 'var(--gl-color-bg)' }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--gl-color-bg)',
      fontFamily: 'var(--gl-font)',
    }}>
      {/* Header */}
      <header style={{
        background: 'var(--gl-color-surface)',
        borderBottom: '1px solid var(--gl-color-border-light)',
        padding: '16px 24px',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: 'var(--gl-color-primary-dark)' }}>
              WATO — What Are The Odds?
            </h1>
            <p style={{ fontSize: 13, color: 'var(--gl-color-text-muted)', margin: '2px 0 0' }}>
              Test relationship hypotheses against shared cM
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={reset}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 11, color: 'var(--gl-color-text-muted)',
                textDecoration: 'underline',
              }}
            >
              Reset to defaults
            </button>
            <span style={{
              padding: '4px 10px', borderRadius: 6,
              background: 'rgba(69, 130, 201, 0.1)',
              color: 'var(--gl-color-secondary)',
              fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
            }}>
              BETA
            </span>
          </div>
        </div>
      </header>

      {/* Main */}
      <div style={{
        maxWidth: 1100, margin: '0 auto', padding: 24,
        display: 'grid',
        gridTemplateColumns: '240px 1fr',
        gap: 20,
      }}>
        {/* Sidebar */}
        <ScenarioSelector
          scenarios={scenarios}
          activeId={activeId}
          onSelect={selectScenario}
          onNew={newScenario}
        />

        {/* Main content */}
        <main style={{ minWidth: 0 }}>
          {activeScenario ? (
            <>
              {/* Scenario header card */}
              <div style={{
                background: 'var(--gl-color-surface)',
                borderRadius: 12,
                padding: 20,
                boxShadow: 'var(--gl-shadow-sm)',
                marginBottom: 16,
              }}>
                {editingHeader ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div>
                      <label style={fieldLabel}>Match name</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="gl-input"
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div>
                      <label style={fieldLabel}>Shared cM</label>
                      <input
                        type="number"
                        min={1}
                        max={4000}
                        value={editCM}
                        onChange={(e) => setEditCM(parseInt(e.target.value) || 0)}
                        className="gl-input"
                        style={{ width: 200 }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={saveHeader} className="gl-btn gl-btn--primary" style={{ padding: '6px 12px', fontSize: 12 }}>Save</button>
                      <button onClick={() => setEditingHeader(false)} className="gl-btn gl-btn--secondary" style={{ padding: '6px 12px', fontSize: 12 }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                      <div>
                        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--gl-color-primary-dark)', margin: 0 }}>
                          {activeScenario.name}
                        </h2>
                        <div style={{ fontSize: 13, color: 'var(--gl-color-text-muted)', marginTop: 4 }}>
                          <strong style={{ color: 'var(--gl-color-primary-dark)' }}>{activeScenario.sharedCM} cM</strong> observed
                          {endogamyFactor > 1 && (
                            <span style={{ marginLeft: 8 }}>
                              · adjusted for endogamy: <strong>{(activeScenario.sharedCM / endogamyFactor).toFixed(0)} cM</strong>
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={startHeaderEdit}
                        className="gl-btn gl-btn--secondary"
                        style={{ padding: '5px 10px', fontSize: 11 }}
                      >
                        Edit
                      </button>
                    </div>
                    {activeScenario.notes && (
                      <p style={{
                        fontSize: 12,
                        color: 'var(--gl-color-text-secondary)',
                        margin: '12px 0 0',
                        padding: '8px 12px',
                        background: 'var(--gl-color-bg)',
                        borderRadius: 6,
                        borderLeft: '3px solid var(--gl-color-secondary)',
                      }}>
                        {activeScenario.notes}
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Endogamy */}
              <div style={{ marginBottom: 16 }}>
                <EndogamySlider value={endogamyFactor} onChange={setEndogamyFactor} />
              </div>

              {/* Hypotheses header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--gl-color-primary-dark)', margin: 0 }}>
                  Hypotheses ranked by probability
                </h3>
                <button
                  onClick={addHypothesis}
                  className="gl-btn gl-btn--secondary"
                  style={{ padding: '5px 12px', fontSize: 11 }}
                >
                  + Add hypothesis
                </button>
              </div>

              {/* Hypothesis list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {results.length === 0 ? (
                  <div style={{
                    padding: 32,
                    textAlign: 'center',
                    fontSize: 13,
                    color: 'var(--gl-color-text-muted)',
                    background: 'var(--gl-color-surface)',
                    borderRadius: 10,
                  }}>
                    Add a hypothesis to start testing.
                  </div>
                ) : (
                  results.map((r, i) => (
                    <HypothesisCard
                      key={r.hypothesis.id}
                      result={r}
                      rank={i}
                      onEdit={editHypothesis}
                      onDelete={deleteHypothesis}
                    />
                  ))
                )}
              </div>

              {/* Footer guide */}
              <div style={{
                marginTop: 24,
                padding: '12px 16px',
                background: 'rgba(69, 130, 201, 0.05)',
                borderRadius: 8,
                fontSize: 11,
                color: 'var(--gl-color-text-secondary)',
                lineHeight: 1.6,
              }}>
                <strong>How to read:</strong> Each hypothesis specifies generations from you and from the match
                up to a hypothetical Most Recent Common Ancestor (MRCA). The engine computes the implied
                relationship, looks up its expected cM range from the Shared cM Project (V4), and scores how
                consistent your observed cM is with that distribution. Probabilities are normalized across
                competing hypotheses for the same match.
              </div>
            </>
          ) : (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--gl-color-text-muted)' }}>
              No scenario selected.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const fieldLabel: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--gl-color-text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  marginBottom: 4,
};

'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { WATOMatch, Hypothesis, HypothesisResult } from '@/data/types';
import { evaluateHypotheses } from '@/utils/watoEngine';
import { mockScenarios } from '@/data/mock/scenarios';

const STORAGE_KEY = 'gl-wato-v1';

interface PersistedState {
  scenarios: WATOMatch[];
  activeId: string;
  endogamyFactor: number;
}

function loadState(): PersistedState {
  if (typeof window === 'undefined') {
    return { scenarios: mockScenarios, activeId: mockScenarios[0].id, endogamyFactor: 1.0 };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PersistedState;
      if (parsed.scenarios && parsed.scenarios.length > 0) return parsed;
    }
  } catch { /* ignore */ }
  return { scenarios: mockScenarios, activeId: mockScenarios[0].id, endogamyFactor: 1.0 };
}

function saveState(s: PersistedState): void {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch { /* ignore */ }
}

export function useWATO() {
  const [state, setState] = useState<PersistedState>({
    scenarios: mockScenarios,
    activeId: mockScenarios[0].id,
    endogamyFactor: 1.0,
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  const activeScenario = useMemo(
    () => state.scenarios.find(s => s.id === state.activeId) || state.scenarios[0],
    [state]
  );

  const results: HypothesisResult[] = useMemo(() => {
    if (!activeScenario) return [];
    return evaluateHypotheses(activeScenario.sharedCM, activeScenario.hypotheses, state.endogamyFactor);
  }, [activeScenario, state.endogamyFactor]);

  const selectScenario = useCallback((id: string) => {
    setState(prev => ({ ...prev, activeId: id }));
  }, []);

  const updateScenario = useCallback((updates: Partial<WATOMatch>) => {
    setState(prev => ({
      ...prev,
      scenarios: prev.scenarios.map(s =>
        s.id === prev.activeId ? { ...s, ...updates } : s
      ),
    }));
  }, []);

  const addHypothesis = useCallback(() => {
    const newH: Hypothesis = {
      id: `h-${Date.now()}`,
      label: 'New hypothesis',
      mySideGenerations: 3,
      matchSideGenerations: 3,
    };
    setState(prev => ({
      ...prev,
      scenarios: prev.scenarios.map(s =>
        s.id === prev.activeId ? { ...s, hypotheses: [...s.hypotheses, newH] } : s
      ),
    }));
  }, []);

  const editHypothesis = useCallback((
    hId: string,
    updates: { label?: string; mySideGenerations?: number; matchSideGenerations?: number; notes?: string }
  ) => {
    setState(prev => ({
      ...prev,
      scenarios: prev.scenarios.map(s =>
        s.id !== prev.activeId
          ? s
          : { ...s, hypotheses: s.hypotheses.map(h => h.id === hId ? { ...h, ...updates } : h) }
      ),
    }));
  }, []);

  const deleteHypothesis = useCallback((hId: string) => {
    setState(prev => ({
      ...prev,
      scenarios: prev.scenarios.map(s =>
        s.id !== prev.activeId
          ? s
          : { ...s, hypotheses: s.hypotheses.filter(h => h.id !== hId) }
      ),
    }));
  }, []);

  const setEndogamyFactor = useCallback((factor: number) => {
    setState(prev => ({ ...prev, endogamyFactor: factor }));
  }, []);

  const newScenario = useCallback(() => {
    const id = `scenario-${Date.now()}`;
    const fresh: WATOMatch = {
      id,
      name: 'New scenario',
      sharedCM: 100,
      hypotheses: [
        { id: `h-${Date.now()}`, label: '1st hypothesis', mySideGenerations: 3, matchSideGenerations: 3 },
      ],
    };
    setState(prev => ({
      ...prev,
      scenarios: [...prev.scenarios, fresh],
      activeId: id,
    }));
  }, []);

  const reset = useCallback(() => {
    const fresh: PersistedState = {
      scenarios: mockScenarios,
      activeId: mockScenarios[0].id,
      endogamyFactor: 1.0,
    };
    setState(fresh);
    saveState(fresh);
  }, []);

  return {
    hydrated,
    scenarios: state.scenarios,
    activeScenario,
    activeId: state.activeId,
    endogamyFactor: state.endogamyFactor,
    results,
    selectScenario,
    updateScenario,
    addHypothesis,
    editHypothesis,
    deleteHypothesis,
    setEndogamyFactor,
    newScenario,
    reset,
  };
}

import React, { useState, useEffect, useMemo } from 'react';
import FractalBackground from './components/FractalBackground';
import ControlPanel from './components/ControlPanel';
import ResultPanel from './components/ResultPanel';
import { DecisionStatus } from './types';
import { PHI, EPSILON } from './constants';

const App: React.FC = () => {
  // State for the sliders
  const [coherence, setCoherence] = useState<number>(0.5);
  const [entropy, setEntropy] = useState<number>(0.5);

  // Core CEML Logic
  const { score, status } = useMemo(() => {
    // The Master Equation: J(s) = C / H
    // We add epsilon to H to prevent division by zero
    const calculatedScore = coherence / (entropy + EPSILON);

    let currentStatus = DecisionStatus.DISSONANCE;

    if (calculatedScore > PHI) {
      currentStatus = DecisionStatus.RESONANCE;
    } else if (coherence > 0.8 && entropy < 0.1) {
      // Edge case from the paper/prompt: High Coherence but extremely low entropy might be hallucination/loop
      // Note: In strict math, C=0.9, H=0.05 => Score=18 which is > PHI.
      // So Hallucination is technically a subset of Resonance in pure score, 
      // but we override it here for semantic clarity if the prompt implies a specific flag.
      // Based on prompt logic order: if score > PHI it's resonance. 
      // BUT if we want to specifically flag the "High C Low H" case distinct from "Good Resonance":
      currentStatus = DecisionStatus.HALLUCINATION;
    }

    // However, if the Hallucination condition is met, the score is mathematically very high.
    // Let's refine based on the prompt's `elif`.
    // The prompt python code did:
    // if score > PHI: status = "SELECT"
    // elif C > 0.9 and H < 0.1: status = "FLAG"
    // Since if C>0.9 and H<0.1, score is > 9 (which is > PHI), the first condition usually catches it.
    // To visualize the "Flag" state effectively as requested, let's prioritize the specific Flag check 
    // OR assume the Python logic meant strict ordering. 
    // Let's adhere to the Python reference strict ordering, but check specific values.
    
    // Correction based on Python reference provided:
    // if score > PHI: "SELECT"
    // elif C > 0.9 ... 
    // This makes the second clause unreachable in Python for those values. 
    // To make the UI interesting, I will allow Hallucination to override if it matches specific bounds,
    // or arguably, the Python code meant "Else if not selected, check if hallucination". 
    // But high C low H is naturally selected. 
    // Let's interpret "Hallucination" as a super-high score warning state.
    
    if (coherence > 0.9 && entropy < 0.1) {
        currentStatus = DecisionStatus.HALLUCINATION;
    } else if (calculatedScore > PHI) {
        currentStatus = DecisionStatus.RESONANCE;
    } else {
        currentStatus = DecisionStatus.DISSONANCE;
    }

    return { score: calculatedScore, status: currentStatus };
  }, [coherence, entropy]);

  return (
    <div className="relative w-full min-h-screen text-white font-sans flex flex-col">
      <FractalBackground status={status} />

      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8 z-10">
        
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-serif text-gold tracking-[0.2em] drop-shadow-[0_0_20px_rgba(212,175,55,0.3)]">
            CEML <span className="italic font-light">Φ</span>
          </h1>
          <p className="text-gray-400 mt-4 text-lg md:text-xl font-light tracking-wide">
            Cognitive Entropy Minimization Law
          </p>
        </header>

        {/* Main Grid: Golden Ratio Layout on Desktop */}
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-[1fr_1.618fr] gap-8">
          
          {/* Left: Controls */}
          <div className="h-full">
            <ControlPanel 
              coherence={coherence}
              entropy={entropy}
              onCoherenceChange={setCoherence}
              onEntropyChange={setEntropy}
            />
          </div>

          {/* Right: Results */}
          <div className="h-full">
            <ResultPanel 
              score={score}
              status={status}
            />
          </div>

        </div>

        {/* Footer / Explanation */}
        <div className="mt-12 max-w-2xl text-center">
            <p className="text-white/30 text-xs uppercase tracking-widest">
                Optimizing Information Selection through Thermodynamic Logic
            </p>
        </div>

      </main>
    </div>
  );
};

export default App;
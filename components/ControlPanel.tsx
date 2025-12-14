import React from 'react';

interface ControlPanelProps {
  coherence: number;
  entropy: number;
  onCoherenceChange: (val: number) => void;
  onEntropyChange: (val: number) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  coherence, 
  entropy, 
  onCoherenceChange, 
  onEntropyChange 
}) => {
  return (
    <section className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl flex flex-col justify-center">
      <h2 className="text-2xl font-serif text-white mb-6 border-b border-white/10 pb-4">
        Injecter une Pensée
      </h2>
      
      {/* Coherence Slider */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-2">
          <label htmlFor="coherence" className="text-gold font-serif tracking-wider text-sm">
            Cohérence (C)
          </label>
          <span className="text-white font-mono text-lg">{coherence.toFixed(2)}</span>
        </div>
        <input
          type="range"
          id="coherence"
          min="0"
          max="1"
          step="0.01"
          value={coherence}
          onChange={(e) => onCoherenceChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold hover:accent-[#eec956] transition-all"
        />
      </div>

      {/* Entropy Slider */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-2">
          <label htmlFor="entropy" className="text-gold font-serif tracking-wider text-sm">
            Entropie (H)
          </label>
          <span className="text-white font-mono text-lg">{entropy.toFixed(2)}</span>
        </div>
        <input
          type="range"
          id="entropy"
          min="0.01"
          max="1"
          step="0.01"
          value={entropy}
          onChange={(e) => onEntropyChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold hover:accent-[#eec956] transition-all"
        />
      </div>

      <div className="mt-4 pt-6 border-t border-white/10 text-center">
        <div className="text-xl font-serif text-gray-400">
          J(s) = <span className="text-gold italic">C</span> / <span className="text-gold italic">H</span>
        </div>
      </div>
    </section>
  );
};

export default ControlPanel;
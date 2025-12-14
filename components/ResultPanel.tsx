import React from 'react';
import { DecisionStatus } from '../types';
import { MAX_VISUAL_SCORE, PHI } from '../constants';

interface ResultPanelProps {
  score: number;
  status: DecisionStatus;
}

const ResultPanel: React.FC<ResultPanelProps> = ({ score, status }) => {
  // SVG Configuration
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate visual progress
  // We clamp visual score because mathematically score can go to infinity if H -> 0
  const visualScore = Math.min(score, MAX_VISUAL_SCORE);
  const progress = visualScore / MAX_VISUAL_SCORE;
  const strokeDashoffset = circumference - (progress * circumference);

  const getColor = () => {
    switch (status) {
      case DecisionStatus.RESONANCE: return 'text-success stroke-success';
      case DecisionStatus.HALLUCINATION: return 'text-neonblue stroke-neonblue';
      case DecisionStatus.DISSONANCE: return 'text-danger stroke-danger';
      default: return 'text-gold stroke-gold';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case DecisionStatus.RESONANCE: return "RÉSONANCE (SÉLECTION)";
      case DecisionStatus.HALLUCINATION: return "FLAG (HALLUCINATION)";
      case DecisionStatus.DISSONANCE: return "DISSONANCE (REJET)";
    }
  };

  const colorClass = getColor();
  const baseStroke = status === DecisionStatus.DISSONANCE ? 'stroke-white/10' : 'stroke-white/10';

  return (
    <section className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
      
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* SVG Ring */}
        <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
          {/* Background Ring */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth="4"
            className={baseStroke}
          />
          {/* Progress Ring */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: isNaN(strokeDashoffset) ? circumference : strokeDashoffset,
              transition: 'stroke-dashoffset 0.5s ease-out, stroke 0.3s ease'
            }}
            className={colorClass.split(' ')[1]} // Take only the stroke class
          />
        </svg>

        {/* Center Score */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-5xl font-serif font-bold ${colorClass.split(' ')[0]}`}>
            {score.toFixed(2)}
          </span>
          <span className="text-xs text-gray-500 mt-2 font-mono uppercase tracking-widest">
            Score CEML
          </span>
        </div>
      </div>

      <div className="mt-8 text-center relative z-10">
         <div className={`text-2xl font-bold tracking-[0.2em] transition-colors duration-300 ${colorClass.split(' ')[0]}`}>
            {getStatusText()}
         </div>
         <div className="text-gray-500 text-sm mt-2 font-mono">
            Seuil Φ ({PHI.toFixed(3)})
         </div>
      </div>

    </section>
  );
};

export default ResultPanel;
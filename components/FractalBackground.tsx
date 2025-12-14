import React, { useMemo } from 'react';
import { DecisionStatus } from '../types';
import { COLORS } from '../constants';

interface FractalBackgroundProps {
  status: DecisionStatus;
}

const FractalBackground: React.FC<FractalBackgroundProps> = ({ status }) => {
  const dots = useMemo(() => {
    const generatedDots = [];
    const numDots = 150;
    
    // Golden angle in radians
    const goldenAngle = 137.508 * (Math.PI / 180);

    for (let i = 0; i < numDots; i++) {
      // Radius follows sqrt(i) to maintain uniform density
      // Multiplier adjusts the spread
      const r = 4.5 * Math.sqrt(i); 
      const theta = i * goldenAngle;

      // Convert polar to percentage offsets from center (50, 50)
      const x = 50 + r * Math.cos(theta);
      const y = 50 + r * Math.sin(theta);

      generatedDots.push({ id: i, x, y });
    }
    return generatedDots;
  }, []);

  const getGlowStyle = () => {
    switch (status) {
      case DecisionStatus.RESONANCE:
        return `0 0 12px ${COLORS.GOLD}, 0 0 20px ${COLORS.SUCCESS}`;
      case DecisionStatus.HALLUCINATION:
        return `0 0 12px ${COLORS.NEON_BLUE}`;
      default:
        return 'none';
    }
  };

  const getDotColor = () => {
     switch (status) {
      case DecisionStatus.RESONANCE:
        return COLORS.SUCCESS; // Subtle tint change
      case DecisionStatus.HALLUCINATION:
        return COLORS.NEON_BLUE;
      case DecisionStatus.DISSONANCE:
      default:
         return 'rgba(212, 175, 55, 0.4)'; // Default dimmed gold
    }
  };

  const isActive = status === DecisionStatus.RESONANCE || status === DecisionStatus.HALLUCINATION;

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none bg-[radial-gradient(circle_at_50%_50%,_#1a1b26_0%,_#000000_100%)]">
      {dots.map((dot) => (
        <div
          key={dot.id}
          className="absolute rounded-full transition-all duration-700 ease-in-out"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: isActive ? '3px' : '2px',
            height: isActive ? '3px' : '2px',
            backgroundColor: isActive ? getDotColor() : 'rgba(212, 175, 55, 0.4)',
            boxShadow: isActive ? getGlowStyle() : 'none',
            opacity: isActive ? 1 : 0.6
          }}
        />
      ))}
      
      {/* Central glow effect */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[100px] transition-colors duration-700"
        style={{
          background: status === DecisionStatus.RESONANCE 
            ? 'rgba(77, 255, 136, 0.05)' 
            : status === DecisionStatus.HALLUCINATION 
              ? 'rgba(0, 243, 255, 0.05)' 
              : 'transparent'
        }}
      />
    </div>
  );
};

export default FractalBackground;
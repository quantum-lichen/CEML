export enum DecisionStatus {
  RESONANCE = "RESONANCE", // Selection
  DISSONANCE = "DISSONANCE", // Rejection
  HALLUCINATION = "HALLUCINATION" // Flag
}

export interface CalculationResult {
  score: number;
  status: DecisionStatus;
}
import type { ComfortStatus } from './recommendation';

export type { ComfortStatus };

export type ComfortFactorImpact = {
  key: string;
  label: string;
  points: number;
  severity: 'low' | 'medium' | 'high';
  explanation: string;
};

export type ComfortIndexResult = {
  score: number;
  status: ComfortStatus;
  conclusion: string;
  factors: ComfortFactorImpact[];
};

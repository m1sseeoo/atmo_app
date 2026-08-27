import type { DashboardIconConfig } from '../components/dashboard/DashboardIcon';

export type Recommendation = {
  title: string;
  value: string;
  icon: DashboardIconConfig;
  extraCount?: number;
  allValues?: string[];
};

export type Metric = {
  label: string;
  value: string;
  note: string;
  icon: DashboardIconConfig;
};

export type DashboardData = {
  comfortIndex: number;
  status: string;
  conclusion: string;
  shouldGoOutTitle: string;
  shouldGoOutSubtitle: string;
  shouldGoOutExplanation: string;
  safeTime: string;
  updatedAt: string;
  recommendations: Recommendation[];
  metrics: Metric[];
};

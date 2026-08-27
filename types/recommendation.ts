export type ComfortStatus =
  | 'условия комфортные'
  | 'условия средние'
  | 'желательна осторожность'
  | 'рекомендуется сократить пребывание'
  | 'лучше перенести выход';

export type ShouldGoOutAdvice = {
  title: string;
  subtitle: string;
  explanation: string;
};

export type OutdoorTimeAdvice = {
  safeTime: string;
  returnAdvice: string;
  worseningNote?: string;
};

export type RecommendationResult = {
  comfortIndex: number;
  status: ComfortStatus;
  conclusion: string;
  shouldGoOut: ShouldGoOutAdvice;
  outdoorTime: OutdoorTimeAdvice;
  wear: string[];
  expect: string[];
  do: string[];
  avoid: string[];
  reasons: string[];
  updatedAt: string;
};

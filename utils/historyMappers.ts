import type { HistoryItem } from '../types/history';
import type { ComfortStatus } from '../types/recommendation';
import { comfortStatusLabel } from '../services/recommendationService';

export function comfortStatusToRouteStatus(
  status: ComfortStatus,
): 'comfortable' | 'medium' {
  return status === 'условия комфортные' ? 'comfortable' : 'medium';
}

export function comfortStatusToLabel(status: ComfortStatus): string {
  const label = comfortStatusLabel(status);
  if (status === 'условия комфортные') {
    return 'Комфортно';
  }
  if (status === 'условия средние') {
    return 'Умеренно';
  }
  return label;
}

export function formatHistoryMetrics(item: HistoryItem): string | null {
  const parts: string[] = [];

  if (item.temperature !== null) {
    parts.push(`${item.temperature.toFixed(1)}°`);
  }
  if (item.humidity !== null) {
    parts.push(`${item.humidity}%`);
  }
  if (item.airQuality !== null) {
    parts.push(`Индекс воздуха (legacy) ${item.airQuality}`);
  }

  return parts.length > 0 ? parts.join(' · ') : null;
}

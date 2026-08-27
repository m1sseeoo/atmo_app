type Point = { x: number; y: number };

export function normalizePoints(
  points: number[],
  width: number,
  height: number,
  padding = 4,
): Point[] {
  if (points.length === 0) {
    return [];
  }

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const chartHeight = height - padding * 2;
  const step = points.length > 1 ? width / (points.length - 1) : 0;

  return points.map((value, index) => ({
    x: index * step,
    y: padding + chartHeight - ((value - min) / range) * chartHeight,
  }));
}

export function buildLinePath(points: Point[]): string {
  if (points.length === 0) {
    return '';
  }

  return points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');
}

export function buildAreaPath(points: Point[], height: number): string {
  if (points.length === 0) {
    return '';
  }

  const line = buildLinePath(points);
  const last = points[points.length - 1];
  const first = points[0];

  return `${line} L ${last.x} ${height} L ${first.x} ${height} Z`;
}

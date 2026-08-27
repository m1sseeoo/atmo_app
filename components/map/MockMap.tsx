import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Ellipse, Line, Path, Rect } from 'react-native-svg';

import { colors, shadows } from '../../constants/theme';
import type { MapStation } from '../../types/map';
import { coverageRadiusToMapSize } from '../../utils/mapProjection';
import { CoverageCircle } from './CoverageCircle';
import { StationPin } from './StationPin';

type MockMapProps = {
  stations: MapStation[];
  height?: number;
  zoomLevel?: number;
  onSelectStation?: (id: string) => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
};

function MapDecorations() {
  return (
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      style={StyleSheet.absoluteFill}
    >
      <Rect x="0" y="0" width="100" height="100" fill="#F3F0E8" />
      <Ellipse cx="72" cy="28" rx="18" ry="12" fill="#D8EBD4" opacity={0.9} />
      <Ellipse cx="22" cy="62" rx="14" ry="10" fill="#D8EBD4" opacity={0.85} />
      <Path
        d="M -5 55 Q 25 48, 45 52 T 85 46 T 105 58"
        stroke="#C8D4DC"
        strokeWidth={0.8}
        fill="none"
        opacity={0.7}
      />
      <Path
        d="M 10 20 L 35 25 L 58 18 L 82 30 L 95 22"
        stroke="#D5DCE3"
        strokeWidth={0.6}
        fill="none"
        opacity={0.65}
      />
      <Path d="M 30 0 L 28 100" stroke="#D5DCE3" strokeWidth={0.6} fill="none" opacity={0.5} />
      <Path d="M 65 0 L 68 100" stroke="#D5DCE3" strokeWidth={0.6} fill="none" opacity={0.45} />
      <Path d="M 0 38 L 100 42" stroke="#D5DCE3" strokeWidth={0.6} fill="none" opacity={0.5} />
      <Path d="M 0 68 L 100 72" stroke="#D5DCE3" strokeWidth={0.6} fill="none" opacity={0.45} />
      <Path
        d="M 48 0 Q 52 35, 50 70 Q 48 90, 46 100"
        stroke="#B8DFF5"
        strokeWidth={2.5}
        fill="none"
        opacity={0.55}
      />
      <Line x1="15" y1="30" x2="88" y2="35" stroke="#E2E8EE" strokeWidth={0.5} />
      <Line x1="8" y1="55" x2="92" y2="58" stroke="#E2E8EE" strokeWidth={0.5} />
    </Svg>
  );
}

type ZoomControlsProps = {
  zoomLevel: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
};

function ZoomControls({ zoomLevel, onZoomIn, onZoomOut }: ZoomControlsProps) {
  const canZoomIn = zoomLevel < 3;
  const canZoomOut = zoomLevel > 1;

  return (
    <View style={styles.zoomWrap} pointerEvents="box-none">
      <Pressable
        onPress={onZoomIn}
        disabled={!canZoomIn}
        style={[styles.zoomBtn, !canZoomIn && styles.zoomBtnDisabled]}
        accessibilityRole="button"
        accessibilityLabel="Увеличить"
      >
        <Text style={styles.zoomText}>+</Text>
      </Pressable>
      <View style={styles.zoomLevelWrap}>
        <Text style={styles.zoomLevel}>{zoomLevel}x</Text>
      </View>
      <View style={styles.zoomDivider} />
      <Pressable
        onPress={onZoomOut}
        disabled={!canZoomOut}
        style={[styles.zoomBtn, !canZoomOut && styles.zoomBtnDisabled]}
        accessibilityRole="button"
        accessibilityLabel="Уменьшить"
      >
        <Text style={styles.zoomText}>−</Text>
      </Pressable>
    </View>
  );
}

export function MockMap({
  stations,
  height = 350,
  zoomLevel = 1,
  onSelectStation,
  onZoomIn,
  onZoomOut,
}: MockMapProps) {
  const mapScale = 1 + (zoomLevel - 1) * 0.06;

  return (
    <View style={[styles.card, { height }]}>
      <View style={styles.mapClip}>
        <View style={[styles.mapArea, { transform: [{ scale: mapScale }] }]}>
          <MapDecorations />

          {stations.map((station) => {
            const selected = station.selected ?? false;
            const size = coverageRadiusToMapSize(
              station.coverageRadius,
              selected,
              zoomLevel,
            );

            return (
              <Pressable
                key={station.id}
                onPress={() => onSelectStation?.(station.id)}
                style={[
                  styles.station,
                  { left: `${station.x}%`, top: `${station.y}%` },
                  selected && styles.stationSelected,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Станция ${station.id}`}
                accessibilityState={{ selected }}
              >
                <CoverageCircle size={size} selected={selected} status={station.status} />
                <StationPin selected={selected} status={station.status} />
              </Pressable>
            );
          })}
        </View>
      </View>

      <ZoomControls zoomLevel={zoomLevel} onZoomIn={onZoomIn} onZoomOut={onZoomOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#F3F0E8',
    position: 'relative',
    ...shadows.card,
  },
  mapClip: {
    flex: 1,
    overflow: 'hidden',
  },
  mapArea: {
    flex: 1,
    position: 'relative',
  },
  station: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    marginLeft: -12,
    marginTop: -12,
  },
  stationSelected: {
    zIndex: 4,
  },
  zoomWrap: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.soft,
    zIndex: 6,
  },
  zoomBtn: {
    width: 34,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomBtnDisabled: {
    opacity: 0.4,
  },
  zoomLevelWrap: {
    alignItems: 'center',
    paddingVertical: 1,
  },
  zoomLevel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
  },
  zoomDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  zoomText: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.textMain,
    lineHeight: 20,
  },
});

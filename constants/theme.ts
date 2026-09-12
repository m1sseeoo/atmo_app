export const colors = {
  background: '#F8FCFF',
  card: '#FFFFFF',
  primary: '#62BDFB',
  primaryDark: '#1688E8',
  primarySoft: '#EAF7FF',
  primaryMid: '#4BB4F8',
  textMain: '#14213D',
  textMuted: '#7A8CA3',
  border: '#E4F1FA',
  inputBg: '#FAFDFF',
  disabled: '#B8D4E8',
  white: '#FFFFFF',
  heroGradientStart: '#C8E8FF',
  heroGradientMid: '#E2F4FF',
  heroGradientEnd: '#F4FBFF',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  xxl: 28,
  pill: 999,
} as const;

export const typography = {
  heroTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 26,
    fontWeight: '700' as const,
    lineHeight: 32,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 19,
  },
  button: {
    fontSize: 17,
    fontWeight: '600' as const,
    lineHeight: 22,
  },
} as const;

export const shadows = {
  hero: {
    shadowColor: '#62BDFB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 6,
  },
  card: {
    shadowColor: '#1688E8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  button: {
    shadowColor: '#1688E8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 4,
  },
  soft: {
    shadowColor: '#14213D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
} as const;

export const layout = {
  screenPadding: 20,
} as const;

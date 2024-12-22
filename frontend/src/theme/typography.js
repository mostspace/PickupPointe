// ----------------------------------------------------------------------

export function remToPx(value) {
  return Math.round(parseFloat(value) * 16);
}

export function pxToRem(value) {
  return `${value / 16}rem`;
}

const responsiveFontSizes = (sizes) => {
  const breakpoints = {
    xs: '@media (max-width:600px)',
    sm: '@media (min-width:600px)',
    md: '@media (min-width:900px)',
    lg: '@media (min-width:1200px)',
  };

  return Object.entries(sizes).reduce((acc, [key, value]) => {
    acc[breakpoints[key]] = { fontSize: pxToRem(value) };
    return acc;
  }, {});
};

// ----------------------------------------------------------------------

const FONT_PRIMARY = 'Public Sans, sans-serif'; // Google Font
// const FONT_SECONDARY = 'CircularStd, sans-serif'; // Local Font

const typography = {
  fontFamily: FONT_PRIMARY,
  fontWeightRegular: 400,
  fontWeightMedium: 600,
  fontWeightBold: 700,
  h1: {
    fontWeight: 800,
    lineHeight: 80 / 64,
    color: '#181818',
    fontFamily: 'Gilroy',
    fontSize: pxToRem(40),
    ...responsiveFontSizes({ sm: 52, md: 58, lg: 64 }),
  },
  h2: {
    fontWeight: 500,
    color: '#181818',
    fontFamily: 'Gilroy',
    lineHeight: 64 / 48,
    fontSize: pxToRem(32),
    ...responsiveFontSizes({ sm: 22, md: 28, lg: 32 }),
  },
  h3: {
    fontWeight: 400,
    lineHeight: 1.5,
    fontSize: pxToRem(28),
    color: '#181818',
    fontFamily: 'Gilroy',
    ...responsiveFontSizes({ xs: 22, sm: 24, md: 26, lg: 28 }),
  },
  h4: {
    fontWeight: 700,
    lineHeight: 1.5,
    color: '#181818',
    fontFamily: 'Gilroy',
    fontSize: pxToRem(24),
    ...responsiveFontSizes({ sm: 20, md: 24, lg: 24 }),
  },
  h5: {
    fontWeight: 500,
    lineHeight: 1.5,
    fontSize: pxToRem(20),
    color: '#181818',
    fontFamily: 'Gilroy-Medium',
    ...responsiveFontSizes({ sm: 18, md: 20, lg: 20 }),
  },
  h6: {
    fontWeight: 500,
    lineHeight: 28 / 18,
    fontSize: pxToRem(18),
    color: '#181818',
    fontFamily: 'Gilroy',
    ...responsiveFontSizes({ sm: 16, md: 18, lg: 18 }),
  },
  subtitle1: {
    fontWeight: 500,
    lineHeight: '25px',
    color: '#181818',
    fontFamily: 'Gilroy',
    fontSize: pxToRem(16),
  },
  subtitle2: {
    fontWeight: 400,
    lineHeight: 22 / 14,
    color: '#181818',
    fontFamily: 'Gilroy',
    fontSize: pxToRem(14),
  },
  subtitle3: {
    fontWeight: 400,
    lineHeight: 22 / 14,
    color: '#666',
    fontFamily: 'Gilroy',
    fontSize: pxToRem(14),
  },
  text1: {
    fontWeight: 400,
    lineHeight: '20px',
    color: '#181818',
    fontFamily: 'Gilroy',
    fontSize: pxToRem(12),
  },
  label: {
    fontWeight: 400,
    lineHeight: 22 / 14,
    color: '#A3A3A3',
    fontFamily: 'Gilroy',
    fontSize: pxToRem(12),
  },
  label1: {
    fontWeight: 400,
    lineHeight: 22 / 14,
    color: '#666',
    paddingBottom: 5,
    fontFamily: 'Gilroy',
    fontSize: pxToRem(12),
  },
  body1: {
    lineHeight: 1.5,
    fontSize: pxToRem(16),
  },
  body2: {
    lineHeight: 22 / 14,
    fontSize: pxToRem(14),
  },
  caption: {
    lineHeight: 1.5,
    fontSize: pxToRem(12),
  },
  overline: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(12),
    textTransform: 'uppercase',
  },
  button: {
    fontWeight: 500,
    lineHeight: 24 / 14,
    fontSize: pxToRem(14),
  },
};

export default typography;

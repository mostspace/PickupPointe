// utils
import { paramCase } from 'src/utils/change-case';

// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  VENDOR: '/vendor',
  SHOPPER: '/shopper',
  MERCHANT: '/merchant',
};

// ----------------------------------------------------------------------

export const paths = {
  post: {
    root: `/post`,
    details: (title) => `/post/${paramCase(title)}`,
  },

  // Vendor
  vendor: {
    root: ROOTS.VENDOR,
    chat: `${ROOTS.VENDOR}/chat`,
  },

  // Shopper
  shopper: {
    root: ROOTS.SHOPPER,
    chat: `${ROOTS.SHOPPER}/chat`,
  },

  // Merchant
  merchant: {
    root: ROOTS.MERCHANT,
    chat: `${ROOTS.MERCHANT}/chat`,
  },
};
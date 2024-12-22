import { useEffect, Suspense, lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
// Components
import SplashScreen from 'src/components/loading-screen/splash-screen';
// Pages
const Page404 = lazy(() => import('src/pages/404.js'));
// Routes
import { homeRoutes } from './home.js';
import { authRoutes } from './auth.js';
import { vendorRoutes } from './vendor.js';
import { shopperRoutes } from './shopper.js';
import { merchantRoutes } from './merchant.js';
import { leaveReviewRoutes } from './leave-review.js';
// Middleware
import UnProtectedRoutes from '../route-components/unprotectedRoutes.js';
import ProtectedRoutes from '../route-components/protectedRoutes.js';

// Preload critical routes for faster user navigation after the initial load
const preloadCriticalRoutes = () => {
  const routesToPreload = [
    'src/pages/home/vendor-details',
    'src/pages/shopper/order-local',
    'src/pages/shopper/find-local-vendors',
    'src/pages/shopper/vendor-profile',
    'src/pages/shopper/orders-history',
    'src/pages/shopper/active-orders',
    'src/pages/shopper/make-order',
    'src/pages/vendor',
    'src/pages/vendor/order-calendar',
    'src/pages/vendor/manage-products',
    'src/pages/vendor/manage-shop',
    'src/pages/vendor/manage-location',
    'src/pages/vendor/manage-users',
  ];

  return Promise.all(routesToPreload.slice(0, 5).map(route => import(route)));
};

const usePreloadCriticalRoutes = () => {
  useEffect(() => {
    preloadCriticalRoutes();
  }, []);
};

// Revert Body CSS attributes
const useRevertBodyStyles = () => {
  useEffect(() => {
    const observer = new MutationObserver(() => {
      document.body.style.paddingRight = '';
      document.body.style.overflow = '';
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style'],
    });

    return () => {
      observer.disconnect();
    };
  }, []);
};

export default function Router() {
  useRevertBodyStyles();
  // usePreloadCriticalRoutes(); // Call preloading function

  return useRoutes([
    {
      element: <UnProtectedRoutes />,
      children: [
        ...authRoutes,
        ...homeRoutes,
        ...merchantRoutes,
        ...leaveReviewRoutes,
      ],
    },
    {
      element: <ProtectedRoutes allowedRoles={['shopper']} />,
      children: [...shopperRoutes],
    },
    {
      element: <ProtectedRoutes allowedRoles={['vendor']} />,
      children: [...vendorRoutes],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
    {
      path: '404',
      element: (
        <Suspense fallback={<SplashScreen />}>
          <Page404 />
        </Suspense>
      ),
    },
    {
      path: 'unauthorized',
      element: (
        <Suspense fallback={<SplashScreen />}>
          <Page404 />
        </Suspense>
      ),
    },
  ]);
}
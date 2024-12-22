import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
// Loading Screen
import SplashScreen from 'src/components/loading-screen/splash-screen';
// Layouts
import FullLayout from 'src/layouts/full-layout';
import CardLayout from 'src/layouts/card-layout';
import SecondaryLayout from 'src/layouts/home/secondary';
// Pages
const OrderLocal = lazy(() => import('src/pages/shopper/order-local'));
const VendorDetails = lazy(() => import('src/pages/home/vendor-details'));
const TermsOfService = lazy(() => import('src/pages/home/terms-of-service'));
const FindLocalVendors = lazy(() => import('src/pages/shopper/find-local-vendors'));
const VendorProfile = lazy(() => import('src/pages/shopper/vendor-profile'));
const MakeOrder = lazy(() => import('src/pages/shopper/make-order'));

// ========================================================================================

const FullLayoutComponent = (Component, props, isSuspense) => (
    <Suspense fallback={isSuspense ? <SplashScreen /> : null}>
        <FullLayout footer={props}>
            <Component/>
        </FullLayout>
    </Suspense>
);

const CardLayoutComponent = (Component, isSuspense) => (
    <Suspense fallback={isSuspense ? <SplashScreen /> : null}>
        <CardLayout>
            <Component/>
        </CardLayout>
    </Suspense>
);

const SecondaryLayoutComponent = (Component) => (
    <Suspense fallback={<SplashScreen />}>
        <SecondaryLayout>
            <Component/>
        </SecondaryLayout>
    </Suspense>
);

// ========================================================================================

export const homeRoutes = [
    {   path: '/', 
        children: [
            {   element: <Navigate to="/order-local" />, index: true    },
            {   path: 'order-local', element: FullLayoutComponent(OrderLocal, 'footer', true)   },
        ]
    },
    {   path: '/vendor-details', element: SecondaryLayoutComponent(VendorDetails)   },
    {   path: '/terms-of-service', element: FullLayoutComponent(TermsOfService) },
    { 
        path: 'find-local-vendors', 
        children: [
            {   element: CardLayoutComponent(FindLocalVendors), index: true },
            {   path: 'vendor-profile/:id', 
                children: [
                    { element: CardLayoutComponent(VendorProfile), index: true },
                    { path: 'make-order', element: FullLayoutComponent(MakeOrder) },
                ],
            },
        ],
    },
];
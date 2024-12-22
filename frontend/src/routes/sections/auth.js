import { lazy, Suspense } from 'react'
import SplashScreen from 'src/components/loading-screen/splash-screen';
import UnAuthenticatedRoutes from '../route-components/unauthenticatedRoutes';

// Shopper
const Login = lazy(() => import('src/pages/auth/login'));
const Register = lazy(() => import('src/pages/auth/register'));
const AccountConfirm = lazy(() => import('src/pages/auth/account-confirm'));
const ShopperRegister = lazy(() => import('src/pages/auth/shopper/register'));
const ForgotPassword = lazy(() => import('src/pages/auth/forgot-password'));
const ResetPassword = lazy(() => import('src/pages/auth/reset-password'));
const NewPassword = lazy(() => import('src/pages/auth/new-password'));

// Vendor
const VendorRegister = lazy(() => import('src/pages/auth/vendor'));
const OwnLocationRegister = lazy(() => import('src/pages/auth/vendor/own-location'));
const PickupLocationRegister = lazy(() => import('src/pages/auth/vendor/pickup-location'));
const BothLocationRegister = lazy(() => import('src/pages/auth/vendor/both-location'));

const LazyComponent = (Component) => (
    <Suspense fallback={<SplashScreen />}>
        <Component />
    </Suspense>
);

export const authRoutes = [
    {
        element: <UnAuthenticatedRoutes />,
        children: [
            {
                path: '/login',
                element: LazyComponent(Login),
            },
            {
                path: '/register',
                children: [
                    { element:LazyComponent(Register), index: true },
                    { path: 'shopper-register', element: LazyComponent(ShopperRegister) },
                    { 
                        path: 'vendor-register',
                        children: [
                            {element:LazyComponent(VendorRegister), index:true},
                            { path: 'own-location', element: LazyComponent(OwnLocationRegister) },
                            { path: 'pickup-location', element: LazyComponent(PickupLocationRegister) },
                            { path: 'both-location', element: LazyComponent(BothLocationRegister) },
                        ],
                    },
                ]
            },
            {
                path: '/forgot-password',
                element: LazyComponent(ForgotPassword),
            },
            {
                path: '/reset-password',
                element: LazyComponent(ResetPassword),
            },
            {
                path: '/new-password',
                element: LazyComponent(NewPassword),
            },
            {
                path: '/account-confirm',
                element: LazyComponent(AccountConfirm),
            },
        ]
    }
];
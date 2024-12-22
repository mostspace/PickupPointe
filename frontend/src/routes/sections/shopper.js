import { lazy, Suspense } from 'react'
import { Navigate } from 'react-router-dom'

// Loading Screen
import SplashScreen from 'src/components/loading-screen/splash-screen';

// Layout
import CardLayout from 'src/layouts/card-layout';
import SidebarLayout from 'src/layouts/sidebar-layout';

// Pages
const Loyalty = lazy(() => import('src/pages/shopper/loyalty'));
const OrdersHistory = lazy(() => import('src/pages/shopper/orders-history'));
const ActiveOrders = lazy(() => import('src/pages/shopper/active-orders'));
const ActiveOrderDetails = lazy(() => import('src/sections/shopper/active-orders/order-details'));
const OrderDetails = lazy(() => import('src/sections/shopper/orders-history/order-details'));
const PersonalInformation = lazy(() => import('src/pages/shopper/personal-information'));
const PaymentMethod = lazy(() => import('src/pages/shopper/payment-method'));
const NotificationsPreferences = lazy(() => import('src/pages/shopper/notifications-preferences'));
const SearchOrder = lazy(() => import('src/pages/shopper/search-order'));
const Notifications = lazy(() => import('src/pages/shopper/notifications'));
const Chat = lazy(() => import('src/pages/shopper/chat'));
const VendorSupport = lazy(() => import('src/pages/shopper/support'));

// ====================================================================================================

const CardLayoutComponent = (Component) => (
    <Suspense fallback={<SplashScreen />}>
        <CardLayout>
            <Component />
        </CardLayout>
    </Suspense>
);

const SidebarLayoutComponent = (Component) => (
    <Suspense fallback={<SplashScreen />}>
        <SidebarLayout>
            <Component />
        </SidebarLayout>
    </Suspense>
);

// ====================================================================================================

export const shopperRoutes = [
    {
        path: '/shopper',
        children: [
            { element: <Navigate to="/shopper/loyalty" />, index: true },
            { path: 'loyalty', element: SidebarLayoutComponent(Loyalty)},
            { 
                path: 'orders-history', 
                children: [
                    {   element: SidebarLayoutComponent(OrdersHistory), index: true },
                    {   path: 'order-details/:id', element: SidebarLayoutComponent(OrderDetails) },
                ],
            },
            { 
                path: 'active-orders', 
                children: [
                    {   element: SidebarLayoutComponent(ActiveOrders), index: true },
                    {   path: 'order-details', element: SidebarLayoutComponent(ActiveOrderDetails) },
                ],
            },
            { path: 'payment-method', element: SidebarLayoutComponent(PaymentMethod)},
            { path: 'notifications-preferences', element: SidebarLayoutComponent(NotificationsPreferences)},
            { path: 'personal-information', element: SidebarLayoutComponent(PersonalInformation)},
            { path: 'search-order', element: CardLayoutComponent(SearchOrder)},
            { path: 'notifications', element: CardLayoutComponent(Notifications)},
            { path: 'chat', element: CardLayoutComponent(Chat), exact: true},
            { path: 'support', element: SidebarLayoutComponent(VendorSupport) },
        ],
    },
];
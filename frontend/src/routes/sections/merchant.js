import { Suspense, lazy } from 'react'
import { Navigate } from 'react-router-dom'
// Components
import SplashScreen from 'src/components/loading-screen/splash-screen'
// Layout
import MainLayout from 'src/layouts/merchant/main'
import DetailsLayout from 'src/layouts/merchant/details'
// Pages
const Login = lazy(() => import('src/pages/auth/merchant/login.js'))
const AllOrders = lazy(() => import('src/pages/merchant/all-orders'))
const OrderDetails = lazy(() => import('src/pages/merchant/all-orders/order-details'))
const OutOfStock = lazy(() => import('src/pages/merchant/all-orders/out-of-stock'))
const ReplaceItem = lazy(() => import('src/pages/merchant/all-orders/replace-item'))
const Customize = lazy(() => import('src/pages/merchant/all-orders/customize'))
const AdjustOrder = lazy(() => import('src/pages/merchant/all-orders/adjust-order'));
const AddAdditionalCharge = lazy(() => import('src/pages/merchant/all-orders/add-additional-charge'));
const Chat = lazy(() => import('src/pages/merchant/chat'));
const ManageItems = lazy(() => import('src/pages/merchant/manage-items'));
const ManageItemOutOfStock = lazy(() => import('src/pages/merchant/manage-items/out-of-stock'));
const Settings = lazy(() => import('src/pages/merchant/settings'));
const AlertVolume = lazy(() => import('src/pages/merchant/settings/alert-volume'));
const RateUs = lazy(() => import('src/pages/merchant/settings/rate-us'));
const GiveUsFeedback = lazy(() => import('src/pages/merchant/settings/give-us-feedback'));
const GetHelp = lazy(() => import('src/pages/merchant/get-help'));
const Integrations = lazy(() => import('src/pages/merchant/settings/integrations'));

// ---------------------------------------------------------------------------------------

const LazyComponent = (Component) => (
  <Suspense fallback={<SplashScreen />}>
    <Component />
  </Suspense>
);

const MainComponent = (Component) => (
  <Suspense fallback={<SplashScreen />}>
    <MainLayout>
      <Component />
    </MainLayout>
  </Suspense>
);

const DetailsComponent = (Component) => (
  <Suspense fallback={<SplashScreen />}>
    <DetailsLayout>
      <Component />
    </DetailsLayout>
  </Suspense>
);

// ---------------------------------------------------------------------------------------

export const merchantRoutes = [
  {
    path: '/merchant',
    children: [
      { element: <Navigate to="/merchant/login" />, index: true },
      { path: 'login', element: LazyComponent(Login) },
      {
        path: 'all-orders',
        children: [
          { element: MainComponent(AllOrders), index: true },
          {
            path: 'order-details/:orderId',
            children: [
              { element: DetailsComponent(OrderDetails), index: true },
              {
                path: 'out-of-stock',
                children: [
                  { element: DetailsComponent(OutOfStock), index: true },
                  { path: 'replace-item', element: DetailsComponent(ReplaceItem) },
                  { path: 'customize', element: DetailsComponent(Customize) },
                ],
              },
              { path: 'adjust-order', element: DetailsComponent(AdjustOrder) },
              { path: 'add-additional-charge', element: DetailsComponent(AddAdditionalCharge) },
            ],
          },
        ],
      },
      {
        path: 'manage-items',
        children: [
          { element: MainComponent(ManageItems), index: true },
          { path: 'out-of-stock', element: DetailsComponent(ManageItemOutOfStock) },
          { path: 'adjust-order', element: DetailsComponent(ManageItemOutOfStock) },
        ],
      },
      { path: 'chat', element: MainComponent(Chat), exact: true},
      {
        path: 'settings',
        children: [
          { element: MainComponent(Settings), index: true },
          { path: 'alert-volume', element: DetailsComponent(AlertVolume) },
          { path: 'rate-us', element: DetailsComponent(RateUs) },
          { path: 'give-us-feedback', element: DetailsComponent(GiveUsFeedback) },
          { path: 'integrations', element: DetailsComponent(Integrations)}
        ],
      },
      { path: 'get-help', element: DetailsComponent(GetHelp) },
    ],
  },
];
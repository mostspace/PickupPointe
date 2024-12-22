import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
// Loading Screen
import SplashScreen from 'src/components/loading-screen/splash-screen';
// Layouts
import SidebarLayout from 'src/layouts/sidebar-layout';
import CardLayout from 'src/layouts/card-layout';
import SimpleLayout from 'src/layouts/simple-layout';
// Pages
const VendorDashboard = lazy(() => import('src/pages/vendor'));
const OrderCalendar = lazy(() => import('src/pages/vendor/order-calendar'));
const ManageOrders = lazy(() => import('src/pages/vendor/manage-orders'));
const OrderDetails = lazy(() => import('src/pages/vendor/manage-orders/order-details'));
const DropoffOrderDetails = lazy(() => import('src/pages/vendor/manage-orders/dropoff-order-details'));
const AutopayOrderDetails = lazy(() => import('src/pages/vendor/manage-orders/autopay-order-details'));
const OrderReport = lazy(() => import('src/pages/vendor/manage-orders/order-report'));
const PickList = lazy(() => import('src/pages/vendor/manage-orders/pick-list'));
const ManageProducts = lazy(() => import('src/pages/vendor/manage-products'));
const ProductDetails = lazy(() => import('src/pages/vendor/manage-products/product-details'));
const AddNewProduct = lazy(() => import('src/pages/vendor/manage-products/add-new-product'));
const ManageInventory = lazy(() => import('src/pages/vendor/manage-inventory'));
const DropOffDetails = lazy(() => import('src/pages/vendor/manage-inventory/drop-off-details'));
const ManageShop = lazy(() => import('src/pages/vendor/manage-shop'));
const CreateShop = lazy(() => import('src/pages/vendor/manage-shop/create-shop'));
const ShopDetail = lazy(() => import('src/pages/vendor/manage-shop/shop-detail'));
const EditShopDetails = lazy(() => import('src/pages/vendor/manage-shop/edit-shop-details'));
const ManageLocation = lazy(() => import('src/pages/vendor/manage-location'));
const AddNewDropOff = lazy(() => import('src/pages/vendor/manage-location/add-drop-off'));
const SearchOrders = lazy(() => import('src/pages/vendor/search-order'));
const Notifications = lazy(() => import('src/pages/vendor/notifications'));
const Chat = lazy(() => import('src/pages/vendor/chat'));
const UpgradeDowngradeServices = lazy(() => import('src/pages/vendor/manage-location/upgrade-downgrade-services'));
const ManageUsers = lazy(() => import('src/pages/vendor/manage-users'));
const AccountDetails = lazy(() => import('src/pages/vendor/account-details'));
const CustomerLoyalty = lazy(() => import('src/pages/vendor/customer-loyalty'));
const GlobalSettings = lazy(() => import('src/pages/vendor/global-settings'));
const VendorSupport = lazy(() => import('src/pages/vendor/support'));

// =======================================================================================================================

const SidebarLayoutComponent = (Component) => (
  <Suspense fallback={<SplashScreen />}>
    <SidebarLayout>
      <Component />
    </SidebarLayout>
  </Suspense>
);

const CardLayoutComponent = (Component) => (
  <Suspense fallback={<SplashScreen />}>
    <CardLayout>
      <Component />
    </CardLayout>
  </Suspense>
);

const SimpleComponent = (Component) => (
  <Suspense fallback={<SplashScreen />}>
    <SimpleLayout>
      <Component />
    </SimpleLayout>
  </Suspense>
);

// =======================================================================================================================

export const vendorRoutes = [
  {
    path: '/vendor',
    children: [
      { element: <Navigate to="/vendor/order-calendar" />, index: true },
      { path: 'order-calendar', element: SidebarLayoutComponent(OrderCalendar) },
      { path: 'dashboard', element: CardLayoutComponent(VendorDashboard) },
      {
        path: 'manage-shop',
        children: [
          { element: SidebarLayoutComponent(ManageShop), index: true },
          { path: 'add-new-shop', element: CardLayoutComponent(CreateShop) },
          {
            path: ':itemId',
            children: [
              { element: CardLayoutComponent(ShopDetail), index: true },
              { path: 'edit-shop-details', element: CardLayoutComponent(EditShopDetails) },
            ],
          },
        ],
      },
      { path: 'search-orders', element: CardLayoutComponent(SearchOrders) },
      { path: 'notifications', element: CardLayoutComponent(Notifications) },
      { path: 'chat', element: CardLayoutComponent(Chat), exact: true },
      {
        path: 'manage-products',
        children: [
          { element: SidebarLayoutComponent(ManageProducts), index: true },
          { path: 'product-details/:itemId', element: SidebarLayoutComponent(ProductDetails) },
          { path: 'add-new-product', element: SidebarLayoutComponent(AddNewProduct) },
        ],
      },
      {
        path: 'manage-inventory',
        children: [
          { element: SidebarLayoutComponent(ManageInventory), index: true },
          { path: 'drop-off-details', element: SidebarLayoutComponent(DropOffDetails) },
        ],
      },
      {
        path: 'manage-orders',
        children: [
          { element: SidebarLayoutComponent(ManageOrders), index: true },
          { path: 'dropoff-order-details', element: SidebarLayoutComponent(DropoffOrderDetails) },
          { path: 'order-details/:id', element: SidebarLayoutComponent(OrderDetails) },
          { path: 'autopay-order-details', element: SidebarLayoutComponent(AutopayOrderDetails) },
          { path: 'order-report', element: SimpleComponent(OrderReport) },
          { path: 'pick-list', element: SimpleComponent(PickList) },
        ],
      },
      {
        path: 'location-details',
        children: [
          { element: SidebarLayoutComponent(ManageLocation), index: true },
          { path: 'add-drop-off', element: SidebarLayoutComponent(AddNewDropOff) },
          { path: 'upgrade-downgrade-services', element: SidebarLayoutComponent(UpgradeDowngradeServices) },
        ],
      },
      { path: 'manage-users', element: SidebarLayoutComponent(ManageUsers) },
      { path: 'personal-information', element: SidebarLayoutComponent(AccountDetails) },
      { path: 'customer-loyalty', element: SidebarLayoutComponent(CustomerLoyalty) },
      { path: 'global-settings', element: SidebarLayoutComponent(GlobalSettings) },
      { path: 'support', element: SidebarLayoutComponent(VendorSupport) },
    ],
  },
];
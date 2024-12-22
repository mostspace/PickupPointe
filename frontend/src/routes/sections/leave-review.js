import { Suspense } from "react";
import { Navigate } from "react-router-dom";
// Layout
import MainLayout from 'src/layouts/leave-review';
// Components
import SplashScreen from "src/components/loading-screen/splash-screen";
// Pages
import Register from "src/pages/auth/leave-review/register";
import ChoosePlatform from "src/pages/leave-review/choose-platform";
import CopyCode from "src/pages/leave-review/copy-code";
import AccountCreated from "src/pages/leave-review/account-created";

// ====================================================================================================

const LazyComponent = (Component) => (
  <Suspense fallback={<SplashScreen />}>
    <MainLayout>
      <Component />
    </MainLayout>
  </Suspense>
);

// ====================================================================================================

export const leaveReviewRoutes = [
  {
    path: "/leave-review",
    children: [
      { element: <Navigate to="/leave-review/register"/>, index: true },
      { path: "register", element: LazyComponent(Register) },
      { path: "account-created", element: LazyComponent(AccountCreated) },
      { path: "choose-platform", element: LazyComponent(ChoosePlatform) },
      { path: "copy-code", element: LazyComponent(CopyCode) },
    ],
  },
];
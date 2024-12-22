import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const UnProtectedRoutes = () => {
    const authState = useSelector((state) => state.auth);
    const userType = authState?.type;

    // if (authState?.token && userType === 'vendor') {
    //     return <Navigate to="/vendor" replace />;
    // }

    return <Outlet />;
}

export default UnProtectedRoutes;

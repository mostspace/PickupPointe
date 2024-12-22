import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const UnAuthenticatedRoutes = () => {
    const authState = useSelector((state) => state.auth);
    const userType = authState?.type;

    if (authState?.token) {
        if(userType === 'vendor') {
            return <Navigate to="/vendor" replace />;
        } else if (userType === 'shopper') {
            return <Navigate to="/shopper" replace />;
        } else {
            return <Navigate to="/" replace />;
        }
    }

    return <Outlet />;
};

export default UnAuthenticatedRoutes;
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = ({allowedRoles}) => {
    const authState = useSelector((state) => state.auth);
    const userType = authState?.type;

    if (!authState?.token) {
        return <Navigate to="/login" replace />;
    }
    if (!allowedRoles.includes(userType)) {
        return <Navigate to="/unauthorized" replace />;
    }
    return <Outlet />;
}

export default ProtectedRoutes;
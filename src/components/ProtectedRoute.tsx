import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSession } from "@/hooks/session.hooks";

function ProtectedRoute() {
    const { session, isLoading } = useSession();
    const location = useLocation();

    if (isLoading) {
        return null;
    }

    if (!session) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
}

export default ProtectedRoute;

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSession } from "@/hooks/session.hooks";

function GuestRoute() {
    const { session, isLoading } = useSession();
    const location = useLocation();

    const from = location.state?.from?.pathname ?? "/";

    if (isLoading) {
        return null;
    }

    if (session) {
        return <Navigate to={from} replace />;
    }

    return <Outlet />;
}

export default GuestRoute;

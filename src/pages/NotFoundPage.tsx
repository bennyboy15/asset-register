import { Link } from "react-router-dom";

function NotFoundPage() {
    return (
        <div>
            <div>404 — Page not found</div>
            <Link to="/">Go back home</Link>
        </div>
    );
}

export default NotFoundPage;

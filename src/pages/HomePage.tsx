import { useAuthLogout } from "@/hooks/auth.hooks";

function HomePage() {
    const { mutate: logout, isPending } = useAuthLogout();

    return (
        <div>
            <div>HomePage</div>
            <button onClick={() => logout()} disabled={isPending}>
                {isPending ? "LOGGING OUT..." : "LOGOUT"}
            </button>
        </div>
    );
}

export default HomePage;

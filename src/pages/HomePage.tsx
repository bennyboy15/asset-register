import { useAssetTypes } from "@/hooks/assetTypes.hooks";
import { useAuthLogout } from "@/hooks/auth.hooks";
import type { AssetType } from "@/types/assetTypes.types";

function HomePage() {
    const { mutate: logout, isPending } = useAuthLogout();
    const { data: assetTypes } = useAssetTypes();
    return (
        <div>
            <div>HomePage</div>
            <button onClick={() => logout()} disabled={isPending}>
                {isPending ? "LOGGING OUT..." : "LOGOUT"}
            </button>
            <ul>
                {assetTypes?.map((a: AssetType) => (
                    <li>{a.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default HomePage;

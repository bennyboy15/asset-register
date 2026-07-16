import AssetTypeRow from "@/components/AssetTypeRow";
import { useAssets } from "@/hooks/assetRegister.hooks";
import { useAssetTypes } from "@/hooks/assetTypes.hooks";
import { useAuthLogout } from "@/hooks/auth.hooks";

function HomePage() {
    const { mutate: logout, isPending } = useAuthLogout();
    const { data: assetTypes } = useAssetTypes();
    const { data: assets } = useAssets();
    return (
        <div>
            <div>HomePage</div>
            <button onClick={() => logout()} disabled={isPending}>
                {isPending ? "LOGGING OUT..." : "LOGOUT"}
            </button>
            <ul className="p-4">
                {assetTypes?.map((a) => (
                    <AssetTypeRow key={a.id} assetType={a} />
                ))}
            </ul>

            <ul>
                {assets?.map((asset) => (
                    <li>
                        {asset.name} {asset.assetType?.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default HomePage;

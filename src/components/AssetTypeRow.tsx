import { useAssetCount } from "@/hooks/assetRegister.hooks";
import type { AssetType } from "@/types/assetTypes.types";

export default function AssetTypeRow({ assetType }: { assetType: AssetType }) {
    const { data: count, isPending } = useAssetCount({ assetTypeId: assetType.id });

    return (
        <li className="flex justify-between rounded-xl border border-gray-200 p-2">
            <span>{assetType.name}</span>
            <span>{isPending ? "…" : count}</span>
        </li>
    );
}

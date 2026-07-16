import type { Tables, TablesInsert, TablesUpdate } from "@/types/database.types";

export type Asset = Tables<"AssetRegister">;
export type AssetInsert = TablesInsert<"AssetRegister">;
export type AssetUpdate = TablesUpdate<"AssetRegister">;

export type AssetFilters = {
    isActive?: boolean;
    assetTypeId?: number;
    search?: string;
};

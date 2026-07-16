import type { Tables, TablesInsert, TablesUpdate } from "@/types/database.types";

export type AssetType = Tables<"AssetTypes">;
export type AssetTypeInsert = TablesInsert<"AssetTypes">;
export type AssetTypeUpdate = TablesUpdate<"AssetTypes">;

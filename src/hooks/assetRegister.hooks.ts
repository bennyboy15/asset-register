import type { AssetFilters, AssetInsert, AssetUpdate } from "@/types/assetRegister.types";
import { supabase } from "@/utils/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useAssets(filters: AssetFilters = {}) {
    const { isActive = true, assetTypeId, search } = filters;

    return useQuery({
        queryKey: ["assets", { isActive, assetTypeId, search }],
        queryFn: async () => {
            let query = supabase
                .from("AssetRegister")
                .select("*, assetType:AssetTypes(*)")
                .eq("isActive", isActive);

            if (assetTypeId !== undefined) {
                query = query.eq("assetTypeId", assetTypeId);
            }
            if (search) {
                query = query.ilike("name", `%${search}%`);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data;
        },
    });
}

export function useAssetCount(filters: AssetFilters = {}) {
    const { isActive = true, assetTypeId } = filters;
    return useQuery({
        queryKey: ["assets", { isActive, assetTypeId }],
        queryFn: async () => {
            let query = supabase
                .from("AssetRegister")
                .select("*", { count: "exact", head: true })
                .eq("isActive", isActive);

            if (assetTypeId !== undefined) {
                query = query.eq("assetTypeId", assetTypeId);
            }

            const { count } = await query;
            return count ?? 0;
        },
    });
}

export function useAsset(id: number) {
    return useQuery({
        queryKey: ["assets", id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("AssetRegister")
                .select("*")
                .eq("id", id)
                .maybeSingle();
            if (error) throw error;
            return data;
        },
    });
}

export function useCreateAsset() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newAsset: AssetInsert) => {
            const { error } = await supabase.from("AssetRegister").insert(newAsset);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["assets"] });
            toast.success("Successfully created Asset");
        },
    });
}

export function useUpdateAsset() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, updatedAsset }: { id: number; updatedAsset: AssetUpdate }) => {
            const { error } = await supabase
                .from("AssetRegister")
                .update(updatedAsset)
                .eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["assets"] });
            toast.success("Successfully updated Asset");
        },
    });
}

export function useDeleteAsset() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            const { error } = await supabase
                .from("AssetRegister")
                .update({ isActive: false })
                .eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["assets"] });
            toast.success("Successfully deleted Asset");
        },
    });
}

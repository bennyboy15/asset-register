import type { AssetTypeInsert, AssetTypeUpdate } from "@/types/assetTypes.types";
import { supabase } from "@/utils/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useAssetTypes() {
    return useQuery({
        queryKey: ["assetTypes"],
        queryFn: async () => {
            const { data, error } = await supabase.from("AssetTypes").select("*");
            if (error) throw error;
            return data;
        },
    });
}

export function useAssetType(id: number) {
    return useQuery({
        queryKey: ["assetTypes", id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("AssetTypes")
                .select("*")
                .eq("id", id)
                .maybeSingle();
            if (error) throw error;
            return data;
        },
    });
}

export function useCreateAssetType() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newAssetType: AssetTypeInsert) => {
            const { error } = await supabase.from("AssetTypes").insert(newAssetType);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["assetTypes"] });
            toast.success("Successfully created Asset Type");
        },
    });
}

export function useUpdateAssetType() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, name }: { id: number } & AssetTypeUpdate) => {
            const { error } = await supabase.from("AssetTypes").update({ name }).eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["assetTypes"] });
            toast.success("Successfully updated Asset Type");
        },
    });
}

export function useDeleteAssetType() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            const { error } = await supabase.from("AssetTypes").delete().eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["assetTypes"] });
            toast.success("Successfully deleted Asset Type");
        },
    });
}

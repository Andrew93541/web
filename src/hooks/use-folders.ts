import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";

export interface Folder {
    id: string;
    name: string;
    parent_id: string | null;
    owner_id: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
}

export interface File {
    id: string;
    name: string;
    mime_type: string;
    size_bytes: string;
    storage_key: string;
    owner_id: string;
    folder_id: string | null;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
}

export interface FolderContents {
    folder: Folder | null;
    children: {
        folders: Folder[];
        files: File[];
    };
    path: Folder[];
}

export function useFolderContents(folderId: string = "root") {
    return useQuery({
        queryKey: ["folder", folderId],
        queryFn: async (): Promise<FolderContents> => {
            const { data } = await api.get(`/folders/${folderId}`);
            return data;
        },
    });
}

export function useCollection(type: "recent" | "trash" | "starred" | "shared") {
    return useQuery({
        queryKey: ["collection", type],
        queryFn: async (): Promise<{ folders: Folder[], files: File[] }> => {
            const { data } = await api.get(`/collections/${type}`);
            return data;
        },
        retry: false,
    });
}

export function useCreateFolder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ name, parentId }: { name: string; parentId?: string | null }) => {
            const { data } = await api.post("/folders", { name, parentId });
            return data;
        },
        onSuccess: (_, variables) => {
            // Invalidate the parent folder so it refetches and shows the new folder instantly
            queryClient.invalidateQueries({ queryKey: ["folder", variables.parentId || "root"] });
            toast.success("Folder created");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.error?.message || "Failed to create folder");
        },
    });
}

export function useDeleteFolder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (folderId: string) => {
            const { data } = await api.delete(`/folders/${folderId}`);
            return data;
        },
        onSuccess: () => {
            // Invalidate all folders to be safe, or we could track context
            queryClient.invalidateQueries({ queryKey: ["folder"] });
            toast.success("Folder moved to trash");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.error?.message || "Failed to delete folder");
        },
    });
}

export function useUpdateFolder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ folderId, name, parentId }: { folderId: string; name?: string; parentId?: string | null }) => {
            const { data } = await api.patch(`/folders/${folderId}`, { name, parentId });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["folder"] });
            queryClient.invalidateQueries({ queryKey: ["search"] });
            toast.success("Folder updated successfully");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.error?.message || "Failed to update folder");
        },
    });
}

export function useToggleStar() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ resourceId, resourceType }: { resourceId: string; resourceType: "file" | "folder" }) => {
            const { data } = await api.post("/collections/star", { resourceId, resourceType });
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["folder"] });
            queryClient.invalidateQueries({ queryKey: ["collection", "starred"] });
            toast.success(data.starred ? "Added to Starred" : "Removed from Starred");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.error?.message || "Failed to toggle star");
        },
    });
}

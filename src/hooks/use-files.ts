import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import axios from "axios";
import { toast } from "sonner";

export function useUploadFile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ file, folderId }: { file: File; folderId?: string | null }) => {
            const formData = new FormData();
            formData.append("file", file);
            if (folderId) formData.append("folderId", folderId);

            // Perform a direct multipart/form-data POST to our Node backend. Node will securely stream it to Supabase.
            const { data } = await api.post("/files/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            return data.file;
        },
        onSuccess: (fileData, variables) => {
            // Force refreshing the visible directory
            queryClient.invalidateQueries({ queryKey: ["folder", variables.folderId || "root"] });
            toast.success(`Uploaded ${fileData.name}`);
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.error?.message || "Failed to upload file");
        },
    });
}

export function useDeleteFile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (fileId: string) => {
            const { data } = await api.delete(`/files/${fileId}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["folder"] });
            toast.success("File moved to trash");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.error?.message || "Failed to delete file");
        },
    });
}

export function useDownloadFile() {
    return useMutation({
        mutationFn: async ({ fileId, filename }: { fileId: string; filename: string }) => {
            const { data } = await api.get(`/files/${fileId}/download`);

            // Programmatically trigger download of the secure URL
            const a = document.createElement("a");
            a.href = data.signedUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();

            return true;
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.error?.message || "Failed to download file");
        },
    });
}

export function useUpdateFile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ fileId, name, folderId }: { fileId: string; name?: string; folderId?: string | null }) => {
            const { data } = await api.patch(`/files/${fileId}`, { name, folderId });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["folder"] });
            queryClient.invalidateQueries({ queryKey: ["search"] });
            toast.success("File updated successfully");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.error?.message || "Failed to update file");
        },
    });
}

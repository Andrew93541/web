import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";

export interface Share {
    id: string;
    grantee_email: string;
    role: "viewer" | "editor";
    created_at: string;
}

export function useShares(resourceType: "file" | "folder", resourceId: string) {
    return useQuery({
        queryKey: ["shares", resourceType, resourceId],
        queryFn: async (): Promise<Share[]> => {
            const { data } = await api.get(`/shares/${resourceType}/${resourceId}`);
            return data.shares;
        },
        enabled: !!resourceId,
    });
}

export function useCreateShare() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ resourceType, resourceId, email, role }: { resourceType: "file" | "folder", resourceId: string, email: string, role: string }) => {
            const { data } = await api.post("/shares", { resourceType, resourceId, email, role });
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["shares", variables.resourceType, variables.resourceId] });
            toast.success("Shared successfully");
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.error?.message || "Failed to share item");
        }
    });
}

export function useRemoveShare() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ shareId }: { shareId: string }) => {
            const { data } = await api.delete(`/shares/${shareId}`);
            return data;
        },
        onSuccess: () => {
            // Can't reliably know the exact query here, so global invalidate or accept the specific id on mutation
            // but just invalidating "shares" globally helps for now.
            queryClient.invalidateQueries({ queryKey: ["shares"] });
            toast.success("Access revoked");
        },
        onError: () => {
            toast.error("Failed to revoke access");
        }
    });
}

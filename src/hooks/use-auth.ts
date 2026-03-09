"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export interface User {
    id: string;
    email: string;
    name: string | null;
    image_url: string | null;
    created_at: string;
}

// Fetch current user
export function useUser() {
    return useQuery({
        queryKey: ["user"],
        queryFn: async (): Promise<User | null> => {
            try {
                const { data } = await api.get("/auth/me");
                return data.user;
            } catch (error) {
                return null;
            }
        },
        retry: false,
    });
}

// Login Mutation
export function useLogin() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: async (credentials: any) => {
            const { data } = await api.post("/auth/login", credentials);
            return data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["user"], data.user);
            toast.success("Logged in successfully");
            router.push("/");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.error?.message || "Failed to login");
        },
    });
}

// Register Mutation
export function useRegister() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: async (credentials: any) => {
            const { data } = await api.post("/auth/register", credentials);
            return data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["user"], data.user);
            toast.success("Account created successfully");
            router.push("/");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.error?.message || "Failed to register");
        },
    });
}

// Logout Mutation
export function useLogout() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: async () => {
            const { data } = await api.post("/auth/logout");
            return data;
        },
        onSuccess: () => {
            queryClient.setQueryData(["user"], null);
            queryClient.invalidateQueries({ queryKey: ["user"] });
            // Invalidate all folders/files
            queryClient.clear();
            toast.success("Logged out");
            router.push("/login");
        },
    });
}

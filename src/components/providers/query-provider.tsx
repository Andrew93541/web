"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { Toaster } from "sonner";

export function QueryProvider({ children }: { children: ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000 * 5, // 5 minutes cache
                        refetchOnWindowFocus: false,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <Toaster position="bottom-right" richColors />
        </QueryClientProvider>
    );
}

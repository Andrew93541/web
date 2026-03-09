import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export interface SearchResult {
    folders: any[];
    files: any[];
}

export function useSearch(query: string) {
    return useQuery({
        queryKey: ["search", query],
        queryFn: async (): Promise<SearchResult> => {
            const { data } = await api.get(`/search?q=${encodeURIComponent(query)}`);
            return data;
        },
        enabled: query.length > 0, // Only perform search if query is not empty
    });
}

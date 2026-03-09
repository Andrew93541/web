"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Search, Settings, HelpCircle, LayoutGrid } from "lucide-react";
import { useUser, useLogout } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: user, isLoading, isError } = useUser();
    const router = useRouter();
    const logout = useLogout();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    useEffect(() => {
        if (!isLoading && (isError || !user)) {
            router.push("/login");
        }
    }, [user, isLoading, isError, router]);

    if (isLoading || !user) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-white">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="flex h-full w-full">
            {/* Sidebar Component */}
            <Sidebar />

            {/* Main Application Area */}
            <div className="flex flex-1 flex-col min-w-0 bg-white shadow-sm ring-1 ring-slate-900/5 sm:rounded-tl-2xl">
                {/* Top Navbar Header */}
                <header className="flex h-16 shrink-0 items-center gap-4 bg-white px-6">
                    <form
                        onSubmit={handleSearch}
                        className="flex flex-1 items-center max-w-2xl bg-slate-100 rounded-full px-4 py-2 ring-1 ring-slate-200 transition-shadow focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white shadow-[0_2px_4px_rgba(0,0,0,0.02)]"
                    >
                        <Search
                            className="h-5 w-5 text-slate-500 shrink-0"
                            aria-hidden="true"
                        />
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full border-0 bg-transparent pl-3 pr-0 text-slate-900 placeholder:text-slate-500 focus:ring-0 sm:text-sm outline-none font-medium"
                            placeholder="Search in Drive..."
                        />
                    </form>
                    <div className="flex items-center gap-1 sm:gap-3 ml-auto">
                        <button className="rounded-full p-2 text-slate-500 hover:bg-slate-100 transition-colors">
                            <HelpCircle className="h-5 w-5" />
                        </button>
                        <Link href="/settings" className="rounded-full p-2 text-slate-500 hover:bg-slate-100 transition-colors">
                            <Settings className="h-5 w-5" />
                        </Link>
                        <button className="rounded-full p-2 text-slate-500 hover:bg-slate-100 transition-colors">
                            <LayoutGrid className="h-5 w-5" />
                        </button>

                        {/* Profile Avatar Trigger */}
                        <button
                            onClick={() => logout.mutate()}
                            title="Logout"
                            className="h-9 w-9 rounded-full overflow-hidden ml-2 ring-2 ring-white shadow-sm ring-offset-2 hover:ring-red-300 transition-all"
                        >
                            <img
                                src={user.image_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${user.name || user.email}`}
                                alt="Profile Avatar"
                                className="h-full w-full object-cover bg-amber-200"
                            />
                        </button>
                    </div>
                </header>

                {/* Page Content Injection */}
                <main className="flex-1 overflow-y-auto bg-white rounded-tl-2xl">
                    {children}
                </main>
            </div>
        </div>
    );
}

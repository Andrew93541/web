"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Cloud,
    FolderDown,
    HardDrive,
    History,
    Settings,
    Star,
    Trash2,
    Users
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "My Drive", href: "/", icon: HardDrive },
    { name: "Shared with me", href: "/shared", icon: Users },
    { name: "Recent", href: "/recent", icon: History },
    { name: "Starred", href: "/starred", icon: Star },
    { name: "Trash", href: "/trash", icon: Trash2 },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-64 flex-col bg-slate-50 border-r border-slate-200">
            {/* Brand Logo */}
            <div className="flex h-16 items-center px-6 border-b border-transparent">
                <Link href="/" className="flex items-center gap-2 font-semibold text-lg text-slate-900">
                    <Cloud className="h-6 w-6 text-blue-600" fill="currentColor" />
                    <span>CloudDrive</span>
                </Link>
            </div>

            {/* New Button Area */}
            <div className="px-4 py-4">
                <button className="flex items-center gap-2 rounded-2xl bg-white px-5 py-4 text-sm font-medium text-slate-700 shadow-sm transition-shadow hover:shadow-md border border-slate-200 w-fit">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19M5 12H19" stroke="url(#paint0_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <defs>
                            <linearGradient id="paint0_linear" x1="5" y1="5" x2="19" y2="19" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#2563EB" />
                                <stop offset="1" stopColor="#9333EA" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <span className="text-slate-800 text-base">New</span>
                </button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto py-2">
                <nav className="space-y-1 px-3">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "group flex items-center gap-3 rounded-r-full px-4 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-blue-100/60 text-blue-900"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        "h-5 w-5 shrink-0",
                                        isActive ? "text-blue-700" : "text-slate-400 group-hover:text-slate-600"
                                    )}
                                    aria-hidden="true"
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Storage Meter */}
            <div className="p-4 mt-auto">
                <div className="rounded-xl bg-slate-100 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                        <Cloud className="h-4 w-4" />
                        <span>Storage</span>
                    </div>
                    <div className="h-2 w-full max-w-full overflow-hidden rounded-full bg-slate-200">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: "45%" }} />
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                        4.5 GB of 10 GB used
                    </p>
                    <button className="mt-3 rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition w-full">
                        Get more storage
                    </button>
                </div>
            </div>
        </div>
    );
}

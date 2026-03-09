"use client";

import { useUser } from "@/hooks/use-auth";
import { User, Mail, Settings, Shield, Bell, Cloud } from "lucide-react";
import { format } from "date-fns";

export default function SettingsPage() {
    const { data: user, isLoading } = useUser();

    if (isLoading || !user) {
        return (
            <div className="flex h-full items-center justify-center bg-white">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col relative w-full bg-slate-50">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-white">
                <div className="flex items-center gap-2 text-xl font-semibold text-slate-800 tracking-tight">
                    <Settings className="h-6 w-6 text-slate-700" />
                    <span>Settings & Profile</span>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-6 max-w-4xl mx-auto w-full">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

                    {/* Profile Header */}
                    <div className="p-8 border-b border-slate-100 flex items-center gap-6">
                        <div className="h-24 w-24 rounded-full overflow-hidden ring-4 ring-blue-50 bg-amber-100 flex-shrink-0">
                            <img
                                src={user.image_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${user.name || user.email}`}
                                alt="Avatar"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">{user.name || "Cloud User"}</h2>
                            <p className="text-slate-500 mt-1 flex items-center gap-1.5">
                                <Mail className="h-4 w-4" />
                                {user.email}
                            </p>
                        </div>
                    </div>

                    {/* Settings Grid */}
                    <div className="p-8 grid gap-8 grid-cols-1 md:grid-cols-2">

                        {/* Account Details */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                                <User className="h-5 w-5 text-blue-500" />
                                Account Details
                            </h3>

                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-4">
                                <div>
                                    <label className="text-xs font-medium text-slate-500">Member Since</label>
                                    <p className="text-sm font-medium text-slate-900 mt-0.5">{format(new Date(user.created_at), "MMMM do, yyyy")}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-500">Tier</label>
                                    <p className="text-sm font-medium text-slate-900 mt-0.5 inline-flex items-center px-2 py-0.5 rounded text-blue-700 bg-blue-100/50 border border-blue-200">
                                        Free Plan
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Storage Details */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                                <Cloud className="h-5 w-5 text-indigo-500" />
                                Storage Usage
                            </h3>

                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-4">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium text-slate-700">4.5 GB Used</span>
                                    <span className="text-slate-500">10 GB Total</span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: "45%" }} />
                                </div>
                                <button className="w-full mt-4 bg-white border border-slate-300 text-slate-700 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition">
                                    Upgrade to Pro
                                </button>
                            </div>
                        </div>

                        {/* Preferences */}
                        <div className="space-y-4 md:col-span-2">
                            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                                <Shield className="h-5 w-5 text-emerald-500" />
                                Preferences
                            </h3>

                            <div className="bg-slate-50 rounded-xl border border-slate-100 divide-y divide-slate-100">
                                <div className="flex items-center justify-between p-4">
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Email Notifications</p>
                                        <p className="text-xs text-slate-500 mt-0.5">Receive updates when files are shared with you.</p>
                                    </div>
                                    <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 bg-blue-600">
                                        <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-4">
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Two-Factor Authentication</p>
                                        <p className="text-xs text-slate-500 mt-0.5">Add an extra layer of security to your account.</p>
                                    </div>
                                    <button className="rounded px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100/50 hover:bg-blue-100 border border-blue-200 transition">
                                        Enable
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

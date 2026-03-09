"use client";

import { useState } from "react";
import { useShares, useCreateShare, useRemoveShare } from "@/hooks/use-shares";
import { Loader2, X, UserMinus, Plus } from "lucide-react";

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    resourceId: string;
    resourceType: "file" | "folder";
    resourceName: string;
}

export function ShareModal({ isOpen, onClose, resourceId, resourceType, resourceName }: ShareModalProps) {
    const { data: shares, isLoading } = useShares(resourceType, resourceId);
    const createShare = useCreateShare();
    const removeShare = useRemoveShare();

    const [email, setEmail] = useState("");
    const [role, setRole] = useState<"viewer" | "editor">("viewer");

    if (!isOpen) return null;

    const handleShare = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !email.includes("@")) return;

        createShare.mutate({ resourceType, resourceId, email, role }, {
            onSuccess: () => setEmail("")
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/20 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-800">Share "{resourceName}"</h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6">
                    <form onSubmit={handleShare} className="flex gap-2 mb-6">
                        <input
                            type="email"
                            placeholder="Add user email..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                            required
                        />
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value as any)}
                            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white transition"
                        >
                            <option value="viewer">Viewer</option>
                            <option value="editor">Editor</option>
                        </select>
                        <button
                            type="submit"
                            disabled={createShare.isPending || !email}
                            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2"
                        >
                            {createShare.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                            Share
                        </button>
                    </form>

                    <div className="space-y-3">
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">People with access</h3>
                        {isLoading ? (
                            <div className="flex justify-center p-4">
                                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                            </div>
                        ) : shares?.length === 0 ? (
                            <p className="text-sm text-slate-500 italic text-center py-2">Only you have access</p>
                        ) : (
                            <div className="max-h-48 overflow-y-auto space-y-2">
                                {shares?.map((share) => (
                                    <div key={share.id} className="flex items-center justify-between bg-slate-50 rounded-lg p-3 border border-slate-100">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-slate-800">{share.grantee_email}</span>
                                            <span className="text-xs text-slate-500 capitalize">{share.role}</span>
                                        </div>
                                        <button
                                            onClick={() => removeShare.mutate({ shareId: share.id })}
                                            className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded transition"
                                            title="Remove access"
                                        >
                                            <UserMinus className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-sm font-medium text-slate-700 transition">
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}

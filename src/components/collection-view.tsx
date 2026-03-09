"use client";

import { Folder, Loader2, Download, Trash, RefreshCw, Info, X, File as FileRecordIcon, HardDrive, Calendar, Star } from "lucide-react";
import { getFileIconComponent } from "@/components/ui/file-type-icon";
import { useState } from "react";
import { useCollection, useToggleStar } from "@/hooks/use-folders";
import { useDownloadFile, useDeleteFile } from "@/hooks/use-files";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import Link from 'next/link';

export default function CollectionView({
    type,
    title,
    icon: Icon
}: {
    type: "recent" | "trash" | "starred" | "shared",
    title: string,
    icon: any
}) {
    const { data, isLoading, isError } = useCollection(type);
    const downloadFile = useDownloadFile();
    const deleteFile = useDeleteFile();
    const toggleStar = useToggleStar();
    const queryClient = useQueryClient();
    const [infoState, setInfoState] = useState<{ isOpen: boolean; file: any } | null>(null);

    const restoreMutation = useMutation({
        mutationFn: async ({ id, resourceType }: { id: string, resourceType: "file" | "folder" }) => {
            const { data } = await api.post("/collections/restore", { resourceId: id, resourceType });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["collection", "trash"] });
            queryClient.invalidateQueries({ queryKey: ["folder"] });
            toast.success("Restored successfully");
        }
    });

    const formatSize = (bytes: string) => {
        const b = parseInt(bytes);
        if (!b) return "0 B";
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(b) / Math.log(k));
        return parseFloat((b / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center bg-white">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="flex h-full flex-col items-center justify-center bg-white p-6 text-center">
                <Icon className="h-12 w-12 text-slate-300 mb-4" />
                <h2 className="text-lg font-semibold text-slate-900">Failed to load {title}</h2>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col relative w-full">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                <div className="flex items-center gap-2 text-xl font-semibold text-slate-800 tracking-tight">
                    <Icon className="h-6 w-6 text-slate-700" />
                    <span>{title}</span>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-6 bg-[#f8f9fa]">

                {/* Folders Section */}
                {data.folders?.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-sm font-semibold text-slate-600 mb-4 tracking-wide uppercase">Folders</h2>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                            {data.folders.map((f: any) => (
                                <div key={f.id} className="group relative flex items-center justify-between space-x-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:bg-slate-50 transition hover:shadow-md">
                                    <div className="flex min-w-0 flex-1 items-center gap-3 cursor-pointer">
                                        <Folder className="h-6 w-6 shrink-0 text-slate-500 fill-slate-200" aria-hidden="true" />
                                        <span className="truncate text-sm font-medium text-slate-900">{f.name}</span>
                                    </div>
                                    <div className="flex items-center shrink-0 gap-1 z-10 ml-2">
                                        {type !== 'trash' && (
                                            <button
                                                onClick={(e) => { e.preventDefault(); toggleStar.mutate({ resourceId: f.id, resourceType: "folder" }); }}
                                                title="Toggle Star"
                                                type="button"
                                                className="text-slate-300 hover:text-yellow-500 bg-transparent rounded transition p-1"
                                            >
                                                <Star className="h-4 w-4" />
                                            </button>
                                        )}
                                        {type === 'trash' && (
                                            <button
                                                onClick={(e) => { e.preventDefault(); restoreMutation.mutate({ id: f.id, resourceType: 'folder' }); }}
                                                title="Restore folder"
                                                className="text-slate-300 hover:text-green-600 bg-transparent rounded transition z-10 p-1 shrink-0 ml-2"
                                            >
                                                <RefreshCw className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Files Section */}
                {data.files?.length > 0 && (
                    <section>
                        <h2 className="text-sm font-semibold text-slate-600 mb-4 tracking-wide uppercase">Files</h2>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                            {data.files.map((file: any) => (
                                <div key={file.id} className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition hover:shadow-md">

                                    <div className="flex h-32 items-center justify-center bg-slate-50 border-b border-slate-100 group-hover:bg-slate-100 transition-colors">
                                        {(() => {
                                            const IconComponent = getFileIconComponent(file.mime_type);
                                            return <IconComponent className="h-12 w-12 text-slate-400" strokeWidth={1} />;
                                        })()}
                                    </div>

                                    <div className="flex flex-1 items-center justify-between p-3 bg-white">
                                        <div className="flex flex-col min-w-0 flex-1 pr-2">
                                            <p className="truncate text-xs font-semibold text-slate-700">{file.name}</p>
                                            <p className="text-[10px] text-slate-500 truncate mt-0.5">{formatSize(file.size_bytes)} • {formatDistanceToNow(new Date(file.created_at))} ago</p>
                                        </div>

                                        <div className="flex items-center shrink-0 gap-0.5 bg-white z-10 ml-2">
                                            {type !== 'trash' && (
                                                <button onClick={(e) => { e.preventDefault(); toggleStar.mutate({ resourceId: file.id, resourceType: 'file' }); }} className="text-slate-400 hover:text-yellow-500 p-1 rounded hover:bg-slate-100 transition" title="Star">
                                                    <Star className="h-4 w-4" />
                                                </button>
                                            )}
                                            <button onClick={(e) => { e.preventDefault(); setInfoState({ isOpen: true, file }); }} className="text-slate-400 hover:text-indigo-600 p-1 rounded hover:bg-slate-100 transition" title="Info">
                                                <Info className="h-4 w-4" />
                                            </button>
                                            {type !== 'trash' && (
                                                <>
                                                    <button onClick={(e) => { e.preventDefault(); downloadFile.mutate({ fileId: file.id, filename: file.name }); }} className="text-slate-400 hover:text-blue-600 p-1 rounded hover:bg-slate-100 transition" title="Download">
                                                        <Download className="h-4 w-4" />
                                                    </button>
                                                    <button onClick={(e) => { e.preventDefault(); deleteFile.mutate(file.id); }} className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-slate-100 transition" title="Trash">
                                                        <Trash className="h-4 w-4" />
                                                    </button>
                                                </>
                                            )}
                                            {type === 'trash' && (
                                                <button onClick={(e) => { e.preventDefault(); restoreMutation.mutate({ id: file.id, resourceType: 'file' }); }} className="text-slate-400 hover:text-green-600 p-1 rounded hover:bg-slate-100 transition" title="Restore">
                                                    <RefreshCw className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.folders?.length === 0 && data.files?.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-slate-300 bg-slate-50">
                        <Icon className="h-10 w-10 text-slate-300 mb-4" />
                        <p className="text-sm font-medium text-slate-700">Empty</p>
                        <p className="text-xs text-slate-500 mt-1">There is nothing here yet.</p>
                    </div>
                )}

            </div>

            {/* Animated File Info Side Panel */}
            <div
                className={`absolute top-0 right-0 h-full w-80 bg-white border-l border-slate-200 shadow-2xl transform transition-transform duration-300 z-40 flex flex-col ${infoState?.isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {infoState?.file && (
                    <>
                        <div className="flex items-center justify-between p-4 border-b border-slate-100">
                            <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                                <Info className="h-4 w-4 text-indigo-500" /> Details
                            </h2>
                            <button onClick={() => setInfoState(null)} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="flex justify-center mb-6">
                                {(() => {
                                    const BigIcon = getFileIconComponent(infoState.file.mime_type);
                                    return <BigIcon className="h-20 w-20 text-indigo-100" strokeWidth={1.5} />;
                                })()}
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">File Name</label>
                                    <p className="text-sm font-medium text-slate-800 mt-1 break-all">{infoState.file.name}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><HardDrive className="h-3 w-3" /> Size</label>
                                        <p className="text-sm text-slate-700 mt-1">{formatSize(infoState.file.size_bytes)}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><FileRecordIcon className="h-3 w-3" /> Type</label>
                                        <p className="text-sm text-slate-700 mt-1 truncate" title={infoState.file.mime_type}>{infoState.file.mime_type?.split('/')[1] || "unknown"}</p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100 space-y-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Calendar className="h-3 w-3" /> Created</label>
                                        <p className="text-sm text-slate-700 mt-1">{new Date(infoState.file.created_at).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Calendar className="h-3 w-3" /> Last Modified</label>
                                        <p className="text-sm text-slate-700 mt-1">{new Date(infoState.file.updated_at).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {type !== 'trash' && (
                            <div className="p-4 bg-slate-50 border-t border-slate-200">
                                <button onClick={() => downloadFile.mutate({ fileId: infoState.file.id, filename: infoState.file.name })} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                    <Download className="h-4 w-4" /> Download File
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

        </div>
    );
}

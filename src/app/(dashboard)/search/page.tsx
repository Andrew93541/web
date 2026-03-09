"use client";

import { useSearchParams } from "next/navigation";
import { useSearch } from "@/hooks/use-search";
import { Folder, Loader2, Download, Trash, RefreshCw, Info, X, File as FileRecordIcon, HardDrive, Calendar } from "lucide-react";
import { useState } from "react";
import { getFileIconComponent } from "@/components/ui/file-type-icon";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useDownloadFile, useDeleteFile } from "@/hooks/use-files";
import { useDeleteFolder } from "@/hooks/use-folders";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";

    const { data, isLoading, isError } = useSearch(query);
    const downloadFile = useDownloadFile();
    const deleteFile = useDeleteFile();
    const deleteFolder = useDeleteFolder();
    const [infoState, setInfoState] = useState<{ isOpen: boolean; file: any } | null>(null);

    const formatSize = (bytes?: string) => {
        if (!bytes) return "0 B";
        const b = parseInt(bytes);
        if (isNaN(b) || b === 0) return "0 B";
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

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                <h2 className="text-lg font-semibold text-slate-900">Search Failed</h2>
                <p className="text-slate-500 mt-2">Could not retrieve search targets.</p>
            </div>
        );
    }

    const hasResults = data && (data.folders.length > 0 || data.files.length > 0);

    return (
        <div className="flex h-full flex-col relative w-full">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                <h1 className="text-xl font-semibold text-slate-800 tracking-tight">
                    Search results for "{query}"
                </h1>
            </div>

            <div className="flex-1 overflow-auto p-6 bg-[#f8f9fa]">
                {!hasResults ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-slate-300 bg-slate-50">
                        <Folder className="h-10 w-10 text-slate-300 mb-4" />
                        <p className="text-sm font-medium text-slate-700">No results found</p>
                        <p className="text-xs text-slate-500 mt-1">Try adjusting your search terminology.</p>
                    </div>
                ) : (
                    <>
                        {data.folders.length > 0 && (
                            <section className="mb-8">
                                <h2 className="text-sm font-semibold text-slate-600 mb-4 tracking-wide uppercase">Folders</h2>
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                                    {data.folders.map((f) => (
                                        <div key={f.id} className="group relative flex items-center justify-between space-x-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:bg-slate-50 transition hover:shadow-md">
                                            <Link href={`/folder/${f.id}`} className="flex min-w-0 flex-1 items-center gap-3 cursor-pointer">
                                                <Folder className="h-6 w-6 shrink-0 text-slate-500 fill-slate-200" aria-hidden="true" />
                                                <span className="truncate text-sm font-medium text-slate-900 focus:outline-none">{f.name}</span>
                                            </Link>
                                            <button
                                                onClick={(e) => { e.preventDefault(); deleteFolder.mutate(f.id); }}
                                                className="text-slate-300 hover:text-red-600 bg-transparent rounded transition z-10 p-1 shrink-0 ml-2"
                                                title="Trash"
                                            >
                                                <Trash className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.files.length > 0 && (
                            <section>
                                <h2 className="text-sm font-semibold text-slate-600 mb-4 tracking-wide uppercase">Files</h2>
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                                    {data.files.map((file) => (
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
                                                    <button onClick={(e) => { e.preventDefault(); setInfoState({ isOpen: true, file }); }} className="text-slate-400 hover:text-indigo-600 p-1 rounded hover:bg-slate-100 transition" title="Info">
                                                        <Info className="h-4 w-4" />
                                                    </button>
                                                    <button onClick={(e) => { e.preventDefault(); downloadFile.mutate({ fileId: file.id, filename: file.name }); }} className="text-slate-400 hover:text-blue-600 p-1 rounded hover:bg-slate-100 transition" title="Download">
                                                        <Download className="h-4 w-4" />
                                                    </button>
                                                    <button onClick={(e) => { e.preventDefault(); deleteFile.mutate(file.id); }} className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-slate-100 transition" title="Trash">
                                                        <Trash className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                )}
            </div>

            {/* Animated File Info Side Panel */}
            <div
                className={`absolute top-0 right-0 h-full w-80 bg-white border-l border-slate-200 shadow-2xl transform transition-transform duration-300 z-40 flex flex-col ${infoState?.isOpen ? "translate-x-0" : "translate-x-full"}`}
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
                        <div className="p-4 bg-slate-50 border-t border-slate-200">
                            <button onClick={(e) => { e.preventDefault(); downloadFile.mutate({ fileId: infoState.file.id, filename: infoState.file.name }); }} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                <Download className="h-4 w-4" /> Download File
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

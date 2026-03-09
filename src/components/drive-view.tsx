"use client";

import { Folder, ChevronRight, HardDrive, Plus, Upload, Loader2, Download, Trash, UserPlus, Info, X, File as FileRecordIcon, Calendar, Star, Edit2, LayoutGrid, List } from "lucide-react";
import { getFileIconComponent } from "@/components/ui/file-type-icon";
import { ShareModal } from "@/components/modals/share-modal";
import { useFolderContents, useCreateFolder, useDeleteFolder, useUpdateFolder, useToggleStar } from "@/hooks/use-folders";
import { useUploadFile, useDownloadFile, useDeleteFile, useUpdateFile } from "@/hooks/use-files";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function DrivePage({ params }: { params?: { folderId?: string } }) {
  const currentFolderId = params?.folderId || "root";
  const { data, isLoading, isError } = useFolderContents(currentFolderId);
  const createFolder = useCreateFolder();
  const uploadFile = useUploadFile();
  const deleteFolder = useDeleteFolder();
  const updateFolder = useUpdateFolder();
  const downloadFile = useDownloadFile();
  const deleteFile = useDeleteFile();
  const updateFile = useUpdateFile();
  const toggleStar = useToggleStar();

  const [shareState, setShareState] = useState<{ isOpen: boolean; resourceId: string; resourceType: "file" | "folder"; resourceName: string } | null>(null);
  const [infoState, setInfoState] = useState<{ isOpen: boolean; file: any } | null>(null);
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "date" | "size">("name");

  const handleRename = (id: string, currentName: string, type: 'file' | 'folder') => {
    const newName = window.prompt("Enter new name:", currentName);
    if (newName && newName.trim() !== "" && newName !== currentName) {
      if (type === 'folder') updateFolder.mutate({ folderId: id, name: newName.trim() });
      if (type === 'file') updateFile.mutate({ fileId: id, name: newName.trim() });
    }
  };

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    createFolder.mutate(
      { name: newFolderName, parentId: currentFolderId === "root" ? null : currentFolderId },
      {
        onSuccess: () => {
          setIsNewFolderOpen(false);
          setNewFolderName("");
        }
      }
    );
  };
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      // Loop or just upload the first one (for MVP, we'll map all)
      acceptedFiles.forEach(file => {
        uploadFile.mutate({
          file,
          folderId: currentFolderId === "root" ? null : currentFolderId
        });
      });
    }
  }, [currentFolderId, uploadFile]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true, // We have a specific upload button
    noKeyboard: true
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
        <HardDrive className="h-12 w-12 text-slate-300 mb-4" />
        <h2 className="text-lg font-semibold text-slate-900">Failed to load Drive</h2>
        <p className="text-slate-500 mt-2">There was an issue retrieving your files. Please try again.</p>
      </div>
    );
  }

  const { folder, children, path } = data;

  // Sorting Application
  const sortedFolders = [...children.folders].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'date') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    return 0;
  });

  const sortedFiles = [...children.files].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'date') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sortBy === 'size') return parseInt(b.size_bytes || '0') - parseInt(a.size_bytes || '0');
    return 0;
  });

  return (
    <div className="flex h-full flex-col relative w-full">

      {/* Dynamic Header & Breadcrumbs */}
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

        <div className="flex items-center gap-2 text-xl font-semibold text-slate-800 tracking-tight flex-wrap">
          <Link href="/" className="hover:text-blue-600 transition-colors">My Drive</Link>
          {path.length > 0 && path.map((p) => (
            <div key={p.id} className="flex items-center gap-2 text-slate-500">
              <ChevronRight className="h-5 w-5 opacity-50" />
              <Link href={`/folder/${p.id}`} className="hover:text-blue-600 transition-colors truncate max-w-[150px]">{p.name}</Link>
            </div>
          ))}
          {folder && (
            <div className="flex items-center gap-2 text-slate-500">
              <ChevronRight className="h-5 w-5 opacity-50" />
              <span className="text-slate-900 truncate max-w-[200px]">{folder.name}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={open}
            disabled={uploadFile.isPending}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors text-sm font-medium border border-slate-200 shadow-sm"
          >
            {uploadFile.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Upload
          </button>
          <button
            onClick={() => setIsNewFolderOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors text-sm font-medium shadow-sm"
          >
            <Plus className="h-4 w-4" />
            New Folder
          </button>
        </div>
      </div>

      {/* Toolbar / Sort / View Toggle */}
      <div className="flex bg-[#f8f9fa] border-b border-slate-200 px-6 py-2 items-center justify-between text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-4">
          <button onClick={() => setSortBy('name')} className={`hover:text-slate-800 transition ${sortBy === 'name' ? 'text-slate-800 font-bold' : ''}`}>Name</button>
          <button onClick={() => setSortBy('date')} className={`hover:text-slate-800 transition ${sortBy === 'date' ? 'text-slate-800 font-bold' : ''}`}>Last Modified</button>
          <button onClick={() => setSortBy('size')} className={`hover:text-slate-800 transition ${sortBy === 'size' ? 'text-slate-800 font-bold' : ''}`}>Size</button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setViewMode('grid')} className={`p-1 rounded ${viewMode === 'grid' ? 'bg-slate-200 text-slate-800' : 'hover:bg-slate-200'} transition`}>
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button onClick={() => setViewMode('list')} className={`p-1 rounded ${viewMode === 'list' ? 'bg-slate-200 text-slate-800' : 'hover:bg-slate-200'} transition`}>
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        {...getRootProps()}
        className={`flex-1 overflow-auto p-6 bg-[#f8f9fa] relative transition-colors ${isDragActive ? "bg-blue-50" : ""}`}
      >
        <input {...getInputProps()} />

        {isDragActive && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-blue-50/80 backdrop-blur-sm rounded-xl m-4 border-2 border-dashed border-blue-500">
            <div className="flex flex-col items-center">
              <Upload className="h-16 w-16 text-blue-600 animate-bounce mb-4" />
              <p className="text-xl font-bold text-blue-700">Drop files here to upload</p>
            </div>
          </div>
        )}

        {/* NEW FOLDER INLINE MODAL COMPONENT */}
        {isNewFolderOpen && (
          <div className="mb-8 p-4 bg-white border border-blue-200 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-4 w-full max-w-sm">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Create New Folder</h3>
            <form onSubmit={handleCreateFolder} className="flex flex-col gap-3">
              <input
                autoFocus
                type="text"
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="w-full rounded border-slate-300 text-sm focus:border-blue-500 focus:ring-blue-500 outline-none p-2 border"
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsNewFolderOpen(false)} className="text-sm text-slate-500 hover:text-slate-700 px-3 py-1.5">Cancel</button>
                <button type="submit" disabled={createFolder.isPending} className="text-sm bg-blue-600 text-white rounded px-4 py-1.5 hover:bg-blue-500 disabled:opacity-50">Create</button>
              </div>
            </form>
          </div>
        )}

        {/* Folders Section */}
        {sortedFolders.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-slate-600 mb-4 tracking-wide uppercase">Folders</h2>
            <div className={viewMode === 'grid' ? "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6" : "flex flex-col gap-2"}>
              {sortedFolders.map((f) => (
                <div key={f.id} className={`group relative flex items-center justify-between space-x-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:bg-slate-50 transition hover:shadow-md ${viewMode === 'list' ? 'p-3' : ''}`}>
                  <Link href={`/folder/${f.id}`} className="flex min-w-0 flex-1 items-center gap-3 cursor-pointer">
                    <Folder className="h-6 w-6 shrink-0 text-slate-500 fill-slate-200" aria-hidden="true" />
                    <span className="truncate text-sm font-medium text-slate-900 focus:outline-none">{f.name}</span>
                  </Link>
                  <div className="flex items-center shrink-0 gap-1 z-10 ml-2">
                    <button
                      onClick={(e) => { e.preventDefault(); toggleStar.mutate({ resourceId: f.id, resourceType: "folder" }); }}
                      title="Toggle Star"
                      type="button"
                      className="text-slate-300 hover:text-yellow-500 bg-transparent rounded transition p-1"
                    >
                      <Star className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => { e.preventDefault(); handleRename(f.id, f.name, "folder"); }}
                      title="Rename folder"
                      type="button"
                      className="text-slate-300 hover:text-indigo-600 bg-transparent rounded transition p-1"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => { e.preventDefault(); setShareState({ isOpen: true, resourceId: f.id, resourceType: "folder", resourceName: f.name }); }}
                      title="Share folder"
                      type="button"
                      className="text-slate-300 hover:text-blue-600 bg-transparent rounded transition p-1"
                    >
                      <UserPlus className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => { e.preventDefault(); deleteFolder.mutate(f.id); }}
                      title="Trash folder"
                      type="button"
                      className="text-slate-300 hover:text-red-600 bg-transparent rounded transition p-1"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Files Section */}
        {sortedFiles.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-slate-600 mb-4 tracking-wide uppercase">Files</h2>
            <div className={viewMode === 'grid' ? "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6" : "flex flex-col gap-2"}>
              {sortedFiles.map((file) => (
                <div key={file.id} className={`group relative flex overflow-hidden rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition hover:shadow-md ${viewMode === 'grid' ? 'flex-col' : 'flex-row items-center p-2'}`}>

                  {/* File Preview Emulation */}
                  <div className={`flex items-center justify-center bg-slate-50 border-slate-100 group-hover:bg-slate-100 transition-colors ${viewMode === 'grid' ? 'h-32 border-b' : 'h-12 w-12 rounded bg-transparent border-0'}`}>
                    {(() => {
                      const Icon = getFileIconComponent(file.mime_type);
                      return <Icon className={viewMode === 'grid' ? "h-12 w-12 text-slate-400" : "h-6 w-6 text-slate-400"} strokeWidth={1} />;
                    })()}
                  </div>

                  <div className={`flex flex-1 items-center justify-between bg-white ${viewMode === 'grid' ? 'p-3' : 'pl-4 pr-2'}`}>
                    <div className="flex flex-col min-w-0 flex-1 pr-2">
                      <p className="truncate text-sm font-semibold text-slate-700">{file.name}</p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{formatSize(file.size_bytes)} • {formatDistanceToNow(new Date(file.created_at))} ago</p>
                    </div>

                    {/* Action Drops */}
                    <div className="flex items-center shrink-0 bg-white z-10 ml-2 shadow-sm rounded-lg border border-slate-100 p-0.5">
                      <button onClick={(e) => { e.preventDefault(); toggleStar.mutate({ resourceId: file.id, resourceType: 'file' }); }} className="text-slate-400 hover:text-yellow-500 p-1.5 rounded hover:bg-slate-50 transition" title="Star">
                        <Star className="h-4 w-4" />
                      </button>
                      <button onClick={(e) => { e.preventDefault(); handleRename(file.id, file.name, "file"); }} className="text-slate-400 hover:text-indigo-600 p-1.5 rounded hover:bg-slate-50 transition" title="Rename">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={(e) => { e.preventDefault(); setInfoState({ isOpen: true, file }); }} className="text-slate-400 hover:text-indigo-600 p-1.5 rounded hover:bg-slate-50 transition" title="Info">
                        <Info className="h-4 w-4" />
                      </button>
                      <button onClick={(e) => { e.preventDefault(); setShareState({ isOpen: true, resourceId: file.id, resourceType: "file", resourceName: file.name }); }} className="text-slate-400 hover:text-emerald-600 p-1.5 rounded hover:bg-slate-50 transition" title="Share">
                        <UserPlus className="h-4 w-4" />
                      </button>
                      <button onClick={(e) => { e.preventDefault(); downloadFile.mutate({ fileId: file.id, filename: file.name }); }} className="text-slate-400 hover:text-blue-600 p-1.5 rounded hover:bg-slate-50 transition" title="Download">
                        <Download className="h-4 w-4" />
                      </button>
                      <button onClick={(e) => { e.preventDefault(); deleteFile.mutate(file.id); }} className="text-slate-400 hover:text-red-600 p-1.5 rounded hover:bg-slate-50 transition" title="Trash">
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {children.folders.length === 0 && children.files.length === 0 && !isNewFolderOpen && (
          <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-slate-300 bg-slate-50">
            <Folder className="h-10 w-10 text-slate-300 mb-4" />
            <p className="text-sm font-medium text-slate-700">This folder is empty</p>
            <p className="text-xs text-slate-500 mt-1">Upload files or create sub-folders here.</p>
          </div>
        )}

      </div>

      {shareState?.isOpen && (
        <ShareModal
          isOpen={true}
          onClose={() => setShareState(null)}
          resourceId={shareState.resourceId}
          resourceType={shareState.resourceType}
          resourceName={shareState.resourceName}
        />
      )}

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
            <div className="p-4 bg-slate-50 border-t border-slate-200">
              <button onClick={() => downloadFile.mutate({ fileId: infoState.file.id, filename: infoState.file.name })} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <Download className="h-4 w-4" /> Download File
              </button>
            </div>
          </>
        )}
      </div>

    </div>
  );
}

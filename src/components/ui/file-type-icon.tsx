import {
    FileIcon as DefaultFileIcon,
    FileText,
    FileImage,
    FileAudio,
    FileVideo,
    FileCode,
    FileArchive,
    FileSpreadsheet,
    FileJson
} from "lucide-react";

export function getFileIconComponent(mimeType?: string) {
    if (!mimeType) return DefaultFileIcon;

    const m = mimeType.toLowerCase();

    if (m.startsWith("image/")) return FileImage;
    if (m.startsWith("video/")) return FileVideo;
    if (m.startsWith("audio/")) return FileAudio;

    if (m.includes("pdf") || m.includes("text/plain")) return FileText;
    if (m.includes("json")) return FileJson;
    if (m.includes("spreadsheet") || m.includes("excel") || m.includes("csv")) return FileSpreadsheet;
    if (m.includes("zip") || m.includes("tar") || m.includes("rar") || m.includes("gzip") || m.includes("7z")) return FileArchive;
    if (m.includes("javascript") || m.includes("typescript") || m.includes("html") || m.includes("css") || m.includes("xml")) return FileCode;

    return DefaultFileIcon;
}

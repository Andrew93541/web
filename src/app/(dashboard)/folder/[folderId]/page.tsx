import DriveView from "@/components/drive-view";

export default async function FolderPage({ params }: { params: Promise<{ folderId: string }> }) {
    const resolvedParams = await params;
    return <DriveView params={resolvedParams} />;
}

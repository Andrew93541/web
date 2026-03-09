"use client";

import CollectionView from "@/components/collection-view";
import { History } from "lucide-react";

export default function RecentPage() {
    return <CollectionView type="recent" title="Recent" icon={History} />;
}

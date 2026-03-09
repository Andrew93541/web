"use client";

import CollectionView from "@/components/collection-view";
import { Star } from "lucide-react";

export default function StarredPage() {
    return <CollectionView type="starred" title="Starred" icon={Star} />;
}

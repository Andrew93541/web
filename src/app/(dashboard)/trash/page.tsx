"use client";

import CollectionView from "@/components/collection-view";
import { Trash2 } from "lucide-react";

export default function TrashPage() {
    return <CollectionView type="trash" title="Trash" icon={Trash2} />;
}

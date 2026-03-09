"use client";

import CollectionView from "@/components/collection-view";
import { Users } from "lucide-react";

export default function SharedPage() {
    return <CollectionView type="shared" title="Shared with me" icon={Users} />;
}

"use client";

import { useWorkspaceSortByStore } from "@/store/wsoption-store";
import { Workspace } from "@prisma/client";
import WorkspaceBanner from "./workspace-banner";

interface WorkspaceBannerContainerProps {
  data: Workspace[];
}
export default function WorkspaceBannerContainer({
  data,
}: WorkspaceBannerContainerProps) {
  const { sortBy } = useWorkspaceSortByStore();

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortBy.type as keyof Workspace];
    const bValue = b[sortBy.type as keyof Workspace];

    if (sortBy.type === "updatedAt") {
      const aTime = new Date(aValue as string).getTime();
      const bTime = new Date(bValue as string).getTime();
      return sortBy.order === "asc" ? bTime - aTime : aTime - bTime;
    }

    if (
      sortBy.type === "name" &&
      typeof aValue === "string" &&
      typeof bValue === "string"
    ) {
      return sortBy.order === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    return 0;
  });
  return (
    <>
      {sortedData.map((workspace) => (
        <WorkspaceBanner key={workspace.id} data={workspace} />
      ))}
    </>
  );
}

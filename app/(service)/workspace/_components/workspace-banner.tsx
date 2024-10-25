import { Workspace } from "@prisma/client";
import WorkspaceFavoriteButton from "./workspace-fav-button";
import Link from "next/link";
import { WORKSPACE_URL } from "@/lib/constant";
import { cn } from "@/lib/utils";

interface WorkspaceBannerProps {
  data: Workspace;
}

export default function WorkspaceBanner({ data }: WorkspaceBannerProps) {
  const isFavorite = data.isFavorite;
  return (
    <div className="relative flex flex-col h-24 w-full bg-black/80 rounded-sm p-2 justify-between group hover:cursor-pointer hover:opacity-90">
      <Link href={`${WORKSPACE_URL}/${data.id}`} className="flex-grow">
        <div className="text-white text-sm font-semibold">{data.name}</div>
      </Link>
      <div
        className={cn(
          "absolute right-2 bottom-2 sm:group-hover:opacity-100  transition-all duration-500 ",
          isFavorite ? "opacity-100" : "opacity-0"
        )}
      >
        <WorkspaceFavoriteButton workspace={data} />
      </div>
    </div>
  );
}

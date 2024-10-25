"use client";
import { toggleFavoriteWorkspace } from "@/actions/workspace-action";
import { cn } from "@/lib/utils";
import { Workspace } from "@prisma/client";
import { Pin, Star } from "lucide-react";
import {TiPin, TiPinOutline} from "react-icons/ti"
import { revalidatePath } from "next/cache";
import { useOptimistic, startTransition } from "react";
import { WORKSPACE_URL } from "@/lib/constant";

interface WorkspaceFavoriteButtonProps {
  workspace: Workspace;
  isHoverRequired? : boolean
}
export default function WorkspaceFavoriteButton({
  workspace, isHoverRequired, 
}: WorkspaceFavoriteButtonProps) {
  const { userId, id, isFavorite } = workspace;
  const [optimisticIsFavorite, toggleOptimisticIsFavorite] = useOptimistic(
    isFavorite,
    () => {
      return !isFavorite;
    }
  );

  const handleFavoriteToggle = async () => {
    startTransition(() => {
      toggleOptimisticIsFavorite(isFavorite);
    });
    const result = await toggleFavoriteWorkspace(userId, id);
    if (result.status === "error") {
    revalidatePath(WORKSPACE_URL, "page");
    }
  };

  return (
    <div
      className={cn(
        "hover:cursor-pointer rounded-full p-1 text-white",
        isHoverRequired ? (optimisticIsFavorite ? "z-10" : "-z-10") : "z-10"
        // (isFavorite && isHoverRequired) ? "z-10" : "-z-10"
      )}
      onClick={handleFavoriteToggle}
    >
      {optimisticIsFavorite ? (
      <TiPin
        size={16}
      />
      ): (
      <TiPinOutline size={16}
        />
      )}
    </div>
  );
}

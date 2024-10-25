"use client";
import { Draggable } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { Ellipsis } from "lucide-react";
import WorkspaceFavoriteButton from "./workspace-fav-button";
import WorkspaceOptionButton from "./workspace-option-button";
import { Workspace } from "@prisma/client";
import { useCurrentWorkspaceStore } from "@/store/wsoption-store";
import Link from "next/link";
import { WORKSPACE_URL } from "@/lib/constant";

interface WorkspaceItemProps {
  workspace: Workspace;
  currentWorkspaceId: string;
  index : number
}
export default function WorkspaceItem({
  workspace,
  currentWorkspaceId,
  index
}: WorkspaceItemProps) {
  const { openedId } = useCurrentWorkspaceStore();
  const isFavorite = workspace.isFavorite

  return (
    <Draggable draggableId={workspace.id} index={index} key={workspace.id} >
      {(provided, snapshot)=>(
      <li
       {...provided.draggableProps}
       {...provided.dragHandleProps}
       ref={provided.innerRef}
       className="relative group text-white">
        <Link
         href={`${WORKSPACE_URL}/${workspace.id}`}
         >
          <div
            className={cn(
              "flex flex-row items-center w-full py-[6px] h-12 px-4 rounded-md justify-between pr-2 group-hover:bg-darkgray text-sm whitespace-nowrap font-medium",
              workspace.id === currentWorkspaceId ? "bg-primary" : "bg-transparent", snapshot.isDragging ? "bg-darkgray"  : ""
            )}
          >
            <div className="flex flex-col">
              <div className="text-sm text-white text-start flex overflow-hidden sm:w-44">
                {workspace.name}
              </div>
              <div className="text-xs leading-4 text-white/50 text-start">
                {workspace.description}
              </div>
            </div>
          </div>
      
        </Link>
        <div
          className={cn(
            "absolute right-1 top-[6px] flex items-center justify-center group-hover:z-10 pr-2 gap-x-1",
            openedId === workspace.id ? "z-10 " : "", 
          )}
        >
          <WorkspaceOptionButton workspace={workspace}>
            <div
              className={cn(
                "opacity-0 group-hover:opacity-100 flex w-9 h-9 rounded-full justify-center items-center hover:cursor-pointer hover:bg-darkgray hover:brightness-125"
              )}
            >
              <Ellipsis size={16} color="white" />
            </div>
          </WorkspaceOptionButton>
          <div className={ cn( "opacity-0 group-hover:opacity-100", isFavorite ? "opacity-100" : "opacity-0" ) }>
          <WorkspaceFavoriteButton workspace={workspace} isHoverRequired={true}/>
          </div>
        </div>
      </li>
      )}
    </Draggable>
  );
}

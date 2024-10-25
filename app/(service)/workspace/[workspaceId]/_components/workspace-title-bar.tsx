"use client";
import { renameWorkspace } from "@/actions/workspace-action";
import { cn } from "@/lib/utils";
import { Workspace } from "@prisma/client";
import { Ellipsis } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  ElementRef,
  startTransition,
  useRef,
  useState,
} from "react";
import WorkspaceFavoriteButton from "../../_components/workspace-fav-button";
import { notFound } from "next/navigation";

interface WorkspaceTitleBarProps {
  data : Workspace;
}
export default function WorkspaceTitleBar({
   data,
}: WorkspaceTitleBarProps) {
  const { data: session } = useSession();
  const [workspaceName, setWorkspaceName] = useState(data.name);
  const isTitleChange = data.name !== workspaceName;
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<ElementRef<"input">>(null);

  const handleTitleChange = () => {
    if (!session || !session.user) {
      notFound()
    }
    const userId = session?.user?.id;
    if (userId) {
      startTransition(async () => {
        if (isTitleChange) {
          const result = await renameWorkspace(
            userId!,
            data.id,
            workspaceName
          );
          if (result.status === "success") {
            // TODO : toast
          }
        }
      });
    }
  };

  const onBlur = () => {
    setIsEditing(false);
    if (workspaceName.length < 1) {
      return setWorkspaceName(data.name);
    }
    handleTitleChange();
  };
  const onKeyDown = (e : React.KeyboardEvent) => {
    if(e.key === "Enter") {
    setIsEditing(false)
    if(workspaceName.length < 1){ 
      return setWorkspaceName(data.name)
    }
    handleTitleChange()
    }
 }

  const handleEditingMode = () => {
    setIsEditing(true);
    inputRef.current?.focus();
  };

  return (
    <div className="px-6 py-1 w-full h-12 bg-black/30 flex justify-between items-center">
      <div className="flex flex-row items-center">
        <div className="relative flex items-center ">
          <h1
            onClick={handleEditingMode}
            className={cn(
              "font-semibold flex h-6 items-center justify-center  text-nowrap  text-white/90 bg-transparent text-sm px-2 hover:bg-darkgray hover:cursor-pointer rounded-sm",
              isEditing ? "text-transparent" : ""
            )}
          >
            {workspaceName}
          </h1>
          <input
            ref={inputRef}
            minLength={1}
            maxLength={20}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            defaultValue={workspaceName}
            onChange={(e) => {
              setWorkspaceName(e.target.value);
            }}
            className={cn(
              "font-semibold text-nowrap absolute left-0 text-white/90 text-sm bg-transparent px-2 focus-visible:outline-none",
              "focus-visible:ring-transparent",
              isEditing ? "z-10" : "-z-10"
            )}
          />
          <div className="hover:bg-darkgray hover:cursor-pointer rounded-sm h-6 w-6 flex items-center justify-center">
            <WorkspaceFavoriteButton
              workspace={data}
              isHoverRequired={false}
            />
          </div>
        </div>
      </div>
      <div className="mr-10 w-8 h-8 flex items-center justify-center rounded-md hover:cursor-pointer hover:bg-darkgray hover:opacity-80">
        <Ellipsis size={14} color="white" />
      </div>
    </div>
  );
}

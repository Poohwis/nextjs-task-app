"use client";
import { closeWorkspace, renameWorkspace } from "@/actions/workspace-action";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { WORKSPACE_URL } from "@/lib/constant";
import { cn } from "@/lib/utils";
import { useCurrentWorkspaceStore } from "@/store/wsoption-store";
import { Workspace } from "@prisma/client";
import { PopoverClose } from "@radix-ui/react-popover";
import { ChevronLeft, ChevronRight, Pen, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";

interface WorkspaceOptionButtonProps {
  children: React.ReactNode;
  workspace: Workspace;
}

export default function WorkspaceOptionButton({
  children,
  workspace,
}: WorkspaceOptionButtonProps) {
  //TODO :add colorscheme in this option
  const { data: session } = useSession();
  const [name, setName] = useState(workspace.name);
  const [description, setDescription] = useState(workspace.description);
  const [isCloseMenuOn, setIsCloseMenuOn] = useState<Boolean>(false);
  const { setOpenId, clear } = useCurrentWorkspaceStore();
  const [isEditing, setIsEditing] = useState(false);
  const inputRefName = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  const originalName = workspace.name;
  const originalDescription = workspace.description;

  const isTitleChange =
    name !== originalName || description !== originalDescription 

  useEffect(() => {
    if (isEditing && inputRefName.current) {
      inputRefName.current.focus();
    }
  }, [isEditing]);

  const handlePopoverClose = () => {
    setName(workspace.name);
    setDescription(workspace.description);
    setIsEditing(false);
    // setIsCloseMenuOn(false);
    clear();
  };

  const handleTitleChange = () => {
    if (name.length < 1) {
      return setName(workspace.name)
    }
    if (!session || !session.user) {
      return { message: "User not authenticated", statas: "error" };
    }

    const userId = session.user.id;
    startTransition(async () => {
      if (isTitleChange) {
        const result = await renameWorkspace(
          userId!,
          workspace.id,
          name,
          description
        );
        if (result.status === "success") {
          // TODO : toast
        }
      }
    });
  };

  const handleCloseWorkspace = () => {
    if (!session || !session.user) {
      return { message: "User not authenticated", statas: "error" };
    }

    const userId = session.user.id;
    startTransition(async () => {
      const result = await closeWorkspace(userId!, workspace.id);
      if (result.status === "success") {
        // TODO : toast and redirect to lastest order workspace
      }
    });
  };

  const onKeyDown = (e : React.KeyboardEvent<HTMLInputElement>)=> {
    if (e.key === "Enter") {
      handleTitleChange()
      setIsEditing(false)
    }
  }

  return (
    <Popover
      onOpenChange={(open) => {
        open ? setOpenId(workspace.id) : handlePopoverClose();
      }}
    >
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align="start" className="px-0">
        {!isCloseMenuOn ? (
          <>
            <div className="flex flex-row justify-between px-4 relative">
              <input
                ref={inputRefName}
                disabled={!isEditing}
                maxLength={20}
                value={name}
                onKeyDown={onKeyDown}
                onChange={(e) => setName(e.target.value)}
                className={cn(
                  "flex text-white font-semibold text-sm text-start bg-transparent pl-[1px] outline-none",
                  isEditing ? "underline" : "no-underline"
                )}
              />
              <div className="flex flex-row absolute right-4">
                <div
                  className="hover:cursor-pointer flex flex-row items-center gap-x-1 mr-2"
                  onClick={() => {
                    setIsEditing(!isEditing);
                  }}
                >
                  {isEditing && !isPending ? (
                    <button
                      onClick={handleTitleChange}
                      className="text-xxs text-white font-bold bg-transparent hover:bg-darkgray border-[1px] border-darkgray rounded-sm px-2 no-underline"
                    >
                      Done
                    </button>
                  ) : (
                    <>
                      <Pen size={10} color={"gray"} />
                      <div className="text-white/40 text-xxs hover:underline">
                        Edit
                      </div>
                    </>
                  )}
                </div>
                <PopoverClose asChild>
                  <X size={14} color="gray" className="hover:cursor-pointer" />
                </PopoverClose>
              </div>
            </div>
            <div className="px-4 -mt-1">
              <input
                disabled={!isEditing}
                value={description}
                maxLength={30}
                onKeyDown={onKeyDown}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                className={cn(
                  "text-xs text-white/50 bg-transparent pl-[1px] outline-none w-[200px]",
                  isEditing ? "underline" : "no-underline"
                )}
              />
            </div>
            <Button
              className="mt-2 w-full flex justify-between hover:bg-darkgray rounded-none border-none "
              onClick={() => {
                setIsCloseMenuOn(true);
              }}
            >
              <div className="text-xs">Close workspace</div>
              <ChevronRight size={14} />
            </Button>
          </>
        ) : (
          <div className="flex flex-col px-4">
            <div className="flex justify-between">
              <ChevronLeft
                size={14}
                className="hover:cursor-pointer"
                onClick={() => {
                  setIsCloseMenuOn(false);
                }}
              />
              <div className="text-xs text-white font-semibold">
                Close Workspace?
              </div>
              <PopoverClose asChild>
                <X size={14} color="gray" className="hover:cursor-pointer" />
              </PopoverClose>
            </div>
            <div className="text-white/80 text-xs mt-2">
              You can find and reopen closed workspaces at the bottom of{" "}
              <PopoverClose asChild>
              <Link href={WORKSPACE_URL} >
              <span className="hover:underline hover:cursor-pointer text-blue-400">
                your workspaces page.
              </span>
              </Link>
              </PopoverClose>
            </div>
            <Button
              variant={"confirm"}
              className="text-xs mt-4 h-8"
              onClick={handleCloseWorkspace}
            >
              Close workspace
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

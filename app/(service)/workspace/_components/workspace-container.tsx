import { auth } from "@/auth";
import { getWorkspacesById } from "@/data/workspace";
import WorkspaceLists from "./workspace-lists";
import { notFound } from "next/navigation";
import PopoverCreateWorkspace from "./popover-create-workspace";
import { Workspace } from "@prisma/client";

interface WorkspaceContainerProps {
  workspaces : Workspace[]
}
export default function WorkspaceContainer({workspaces} : WorkspaceContainerProps) {

  if (!workspaces || workspaces?.length === 0) {
    return (
      <PopoverCreateWorkspace>
        <div className="flex justify-center items-center flex-col mt-4 px-4 py-4 bg-darkgray rounded-xl group hover:cursor-pointer">
          <div className="text-white text-sm font-bold">
            No workspace created
          </div>
          <div className="text-white/80 text-xs group-hover:underline">
            Create new workspace
          </div>
        </div>
      </PopoverCreateWorkspace>
    );
  }

  return (
    <div className="mt-2">
      <WorkspaceLists workspaces={workspaces} />
    </div>
  );
}

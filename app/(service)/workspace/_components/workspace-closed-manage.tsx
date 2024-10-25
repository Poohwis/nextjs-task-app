import { auth } from "@/auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getClosedWorkspaceById } from "@/data/workspace";
import { WORKSPACE_URL } from "@/lib/constant";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";
import WorkspaceReopenButton from "./workspace-reopen-button";
import WorkspaceDeleteButton from "./workspace-delete-button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface WorkspaceClosedManageDialogProps {
  children : React.ReactNode
}
export default async function WorkspaceClosedManageDialog({children} : WorkspaceClosedManageDialogProps) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    redirect("/");
  }
  const closedWorkspace = (await getClosedWorkspaceById(userId)) || [];
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="bg-black" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-white text-base font-bold">
            Closed workspaces
          </DialogTitle>
          <DialogDescription className="text-xs">
            Manage your closed workspaces below.
          </DialogDescription>
        </DialogHeader>
        {!closedWorkspace.length && (
          <div className="text-white/80 text-xs bg-white/20 flex items-center justify-center h-12 rounded-sm">
            No workspace have been closed
          </div>
        )}
        <div className="flex flex-col">
          <ScrollArea className="max-h-[80vh]">
            {closedWorkspace
              .filter((workspace) => workspace.isClosed)
              .map((workspace, index) => (
                <div
                  key={workspace.id}
                  className={cn(
                    "mx-4 flex flex-row justify-between py-3 items-center",
                    index !== closedWorkspace.length - 1
                      ? "border-b-[1px] border-white/15"
                      : null
                  )}
                >
                  <div className="flex flex-col h-full justify-start ">
                    <Link href={`${WORKSPACE_URL}/${workspace.id}`}>
                      <div className="text-sm text-white hover:underline">
                        {workspace.name}
                      </div>
                    </Link>
                    <div className="text-xs text-white/50">
                      {workspace.description}
                    </div>
                  </div>
                  <div className="flex flex-row gap-x-2">
                    <WorkspaceReopenButton workspaceId={workspace.id} />
                    <WorkspaceDeleteButton workspaceId={workspace.id} />
                  </div>
                </div>
              ))}
            <ScrollBar />
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

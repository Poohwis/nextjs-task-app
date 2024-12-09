import { auth } from "@/auth";
import { getWorkspacesById } from "@/data/workspace";
import { redirect } from "next/navigation";
import PopoverCreateWorkspace from "./_components/popover-create-workspace";
import { db } from "@/lib/db";
import { WORKSPACE_LIMIT } from "@/lib/constant";
import WorkspaceClosedManageDialog from "./_components/workspace-closed-manage";
import WorkspaceSortButton from "./_components/workspace-sort-button";
import WorkspaceBannerContainer from "./_components/workspace-banner-container";
import { Button } from "@/components/ui/button";

export default async function WorkspacesPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/");
  }

  const workspaces = (await getWorkspacesById(userId, "createAt")) || [];
  const remainWorkspace = WORKSPACE_LIMIT - (await db.workspace.count());

  return (
    <div className="sm:ml-0 ml-4 flex justify-center w-full h-full">
      <div className="sm:pt-[10vh] pt-4 h-full max-w-screen-2xl w-full px-4">
        <h1 className="text-white text-base font-semibold">Workspaces</h1>
        <WorkspaceSortButton />
        <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 my-6 ">
          {remainWorkspace !== 0 ? (
            <PopoverCreateWorkspace>
              <div className=" flex flex-col items-center justify-center bg-black/50 rounded-sm h-24 hover:cursor-pointer hover:opacity-90">
                <div className="text-white text-xs font-semibold">
                  Create new workspace
                </div>
                <div className="text-xxs text-white/80">
                  {remainWorkspace} remaining
                </div>
              </div>
            </PopoverCreateWorkspace>
          ) : (
            <WorkspaceClosedManageDialog>
              <div className=" flex flex-col items-center justify-center bg-white/20 rounded-sm h-24 hover:cursor-pointer hover:opacity-90">
                <div className="text-white text-xs font-semibold">
                  Manage your workspaces
                </div>
                <div className="text-xxs text-white/80">
                  Workspace limit reached
                </div>
              </div>
            </WorkspaceClosedManageDialog>
          )}
          <WorkspaceBannerContainer data={workspaces} />
        </div>
        <WorkspaceClosedManageDialog>
          <Button
            size="sm"
            className="text-white text-xs font-semibold rounded-sm my-6 sm:w-auto w-full"
          >
            View closed workspaces
          </Button>
        </WorkspaceClosedManageDialog>
      </div>
    </div>
  );
}

import { auth } from "@/auth";
import { db } from "@/lib/db";
import WorkspaceClosedBanner from "./_components/workspace-closed-banner";
import WorkspaceTitleBar from "./_components/workspace-title-bar";
import ListWrapper from "./_components/list-wrapper";

interface WorkspaceParams {
  params: {
    workspaceId: string;
  };
}
export default async function WorkspacePage({ params }: WorkspaceParams) {
  const { workspaceId } = params;
  const session = await auth();
  if (!session) {
    return (
      <div className="pt-20 text-white">No Authentication, please login</div>
    );
  }
  const userId = session?.user?.id;
  const workspace = await db.workspace.findUnique({
    where: { id: workspaceId, userId },
  });

  if (!workspace) {
    return <div className="pt-20 text-white">No workspace</div>;
  }
  return (
    <div className="overflow-hidden flex flex-col w-full h-screen">
      <WorkspaceTitleBar data={workspace} />
      {workspace.isClosed && (
        <WorkspaceClosedBanner workspaceId={workspace.id} />
      )}
      <ListWrapper workspaceId={workspaceId} />
    </div>
  );
}

import { db } from "@/lib/db";

export async function getListsById(userId: string, workspaceId: string) {
  const workspace = await db.workspace.findFirst({
    where: {
      id: workspaceId,
      userId,
    },
    include: {
      lists: {
        orderBy: { order: "asc" },
        include: {
          cards: {
            orderBy: { order: "asc" },
          },
        },
      },
      
    },
  });

  if (!workspace) {
    throw new Error("Workspace not found or user does not have access");
  }
  const result = {isClosed : workspace.isClosed,lists : workspace.lists}

  return result;
}

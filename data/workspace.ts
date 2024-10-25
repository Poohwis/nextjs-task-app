import { db } from "@/lib/db";

type orderBy = "createAt" | "default";
export const getWorkspacesById = async (userId: string, orderBy: orderBy) => {
  try {
    const workspaces = await db.workspace.findMany({
      where: { userId, isClosed: false },
      orderBy:
        orderBy === "default"
          ? [{ isFavorite: "desc" }, { order: "asc" }]
          : { createdAt: "asc" },
    });
    return workspaces;
  } catch (error) {
    console.error(error);
    //find more practical way to handle this :
    //  throw error | redirect to dynamic error page - recieve the message and show error
    return null;
  }
};

export const getClosedWorkspaceById = async (userId: string) => {
  try {
    const closedWorkspace = await db.workspace.findMany({
      where: { userId, isClosed: true },
    });

    return closedWorkspace;
  } catch (error) {
    console.error(error);
    return null;
  }
};

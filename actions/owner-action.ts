"use server";

import { db } from "@/lib/db";

export const IsUserWorkspaceAuthorized = async (
  userId: string,
  workspaceId: string
) => {
  try {
  const workspace = await db.workspace.findUnique({where : {userId, id: workspaceId}})
    if (!workspace) {
        return false
    }
    return true
  } catch (error) {
    console.error(error);
    return { message: String(error), status: "error" };
  }
};

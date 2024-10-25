"use server";
import { WORKSPACE_LIMIT, WORKSPACE_URL } from "@/lib/constant";
import { db } from "@/lib/db";
import { NewWorkspaceSchema } from "@/schemas";
import { Workspace } from "@prisma/client";
import { revalidatePath } from "next/cache";
import * as z from "zod";

export const createWorkspace = async (
  values: z.infer<typeof NewWorkspaceSchema>,
  userId: string
) => {
  const validatedFields = NewWorkspaceSchema.safeParse(values);

  if (!validatedFields.success) {
    return { title: "Invalid fields", status: "error" };
  }
  try {
    const workspaceCount = await db.workspace.count({ where: { userId } });
    if (workspaceCount >= WORKSPACE_LIMIT) {
      return {
        status: "error",
        title: "Workspace limit reached.",
        description: "Manage your workspaces to add new ones.",
      };
    }

    const { name, description } = validatedFields.data;
    const newWorkspace = await db.workspace.create({
      data: {
        name,
        description: description || "",
        userId,
        order: workspaceCount + 1,
      },
    });
    revalidatePath(WORKSPACE_URL, "page");
    return {
      title: "Workspace created successfully",
      status: "success",
      workspaceId: newWorkspace.id,
    };
  } catch (error) {
    console.error(error);
    return { title: "Something went wrong", status: "error" };
  }
};

export const deleteWorkspace = async (workspaceId: string, userId: string) => {
  try {
    const workspace = await db.workspace.findUnique({
      where: { id: workspaceId, userId },
    });

    if (!workspace) {
      return {
        title: "Workspace not found or not owned by user",
        status: "error",
      };
    }

    await db.workspace.delete({
      where: { id: workspaceId },
    });

    //reorder the rest of data
    await db.workspace.updateMany({
      where: { userId, order: { gt: workspace.order } },
      data: {
        order: {
          decrement: 1,
        },
      },
    });

    revalidatePath(WORKSPACE_URL, "page");
    //TODO : add redirect to workspace that has order lower than deleted workspace
    return { title: "Workspace deleted", status: "success" };
  } catch (error) {
    console.error(error);
    return { title: "Something went wrong", status: "error" };
  }
};

export const renameWorkspace = async (
  userId: string,
  workspaceId: string,
  name?: string,
  description?: string
) => {
  try {
    const workspace = await db.workspace.findUnique({
      where: { id: workspaceId, userId },
    });
    if (!workspace) {
      return {
        title: "Workspace not found or not owned by user",
        status: "error",
      };
    }

    const updateData: { name?: string; description?: string } = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;

    await db.workspace.update({
      where: { id: workspaceId },
      data: updateData,
    });

    revalidatePath(WORKSPACE_URL, "page");
    return { title: "Workspace updated successfully.", status: "success" };
  } catch (error) {
    console.error(error);
    return {
      title: "Something went wrong.",
      description: "There was a problem with creating new workspace.",
      status: "error",
    };
  }
};

export const toggleFavoriteWorkspace = async (
  userId: string,
  workspaceId: string
) => {
  try {
    const workspace = await db.workspace.findFirst({
      where: { id: workspaceId, userId },
    });
    if (!workspace) {
      return {
        title: "Workspace not found or not owned by user.",
        status: "error",
      };
    }

    const newFavoriteStatus = !workspace.isFavorite;
    await db.workspace.update({
      where: { id: workspaceId },
      data: { isFavorite: newFavoriteStatus },
    });

    revalidatePath(WORKSPACE_URL, "page");
    return { title: "Workspace updated successfully.", status: "success" };
  } catch (error) {
    console.error(error);
    return {
      title: "Something went wrong.",
      description: "There was a problem with your request.",
      status: "error",
    };
  }
};

export const closeWorkspace = async (userId: string, workspaceId: string) => {
  try {
    const workspace = await db.workspace.findUnique({
      where: { id: workspaceId, userId },
    });

    if (!workspace) {
      return {
        title: "Workspace not found or not owned by user",
        status: "error",
      };
    }
    const workspaceName = workspace.name;

    await db.workspace.update({
      where: { id: workspaceId },
      data: { isClosed: true },
    });
    revalidatePath(WORKSPACE_URL, "page");
    return {
      title: `Workspace ${workspaceName} has been closed`,
      status: "success",
    };
  } catch (error) {
    console.error(error);
    return {
      title: "Something went wrong",
      description: "There was problem with closing workspace.",
      status: "error",
    };
  }
};

export const reopenWorkspace = async (userId: string, workspaceId: string) => {
  try {
    const workspace = await db.workspace.findUnique({
      where: { id: workspaceId, userId },
    });

    if (!workspace) {
      return {
        title: "Workspace not found or not owned by user",
        status: "error",
      };
    }
    const workspaceName = workspace.name;

    await db.workspace.update({
      where: { id: workspaceId },
      data: { isClosed: false },
    });
    revalidatePath(WORKSPACE_URL, "page");
    return {
      title: "Reopen successfully",
      description: `Workspace: ${workspaceName} has been reopened`,
      status: "success",
    };
  } catch (error) {
    console.error(error);
    return {
      title: "Something went wrong.",
      description: "There was a problem with reopening workspace.",
      status: "error",
    };
  }
};

export const reorderWorkspace = async (
  userId: string,
  reorderedWorkspace: Workspace[]
) => {
  try {
    const workspace = await db.workspace.findFirst({
      where: { userId },
    });

    if (!workspace) {
      return {
        title: "Workspace not found or not owned by user.",
        status: "error",
      };
    }

    const updatedOrder = reorderedWorkspace.map((workspace, index) =>
      db.workspace.update({
        where: { id: workspace.id },
        data: { order: index + 1 },
      })
    );

    await Promise.all(updatedOrder);

    revalidatePath(WORKSPACE_URL, "page");
    return { title: "Workspace reordered.", status: "success" };
  } catch (error) {
    console.error(error);
    return {
      title: "Something went wrong",
      description: "There was a problem with reordering workspace.",
      status: "error",
    };
  }
};

export const updateWorkspaceTimestamp = async (workspaceId: string) => {
  try {
    await db.workspace.update({
      where: { id: workspaceId },
      data: { updatedAt: new Date() },
    });
  } catch (error) {
    console.error("Failed to update workspace timestamp", error);
  }
};

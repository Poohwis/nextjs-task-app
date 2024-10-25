"use server";
import { ListWithCards } from "@/app/(service)/workspace/[workspaceId]/_components/list-section";
import { WORKSPACE_URL } from "@/lib/constant";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { updateWorkspaceTimestamp } from "./workspace-action";

export const createList = async (name: string, workspaceId: string) => {
  try {
    const listCount = await db.list.count({ where: { workspaceId } });

    await db.list.create({
      data: { name, order: listCount + 1, workspaceId },
    });

    await updateWorkspaceTimestamp(workspaceId);

    revalidatePath(WORKSPACE_URL, "page");
    return {
      title: "List created successfully.",
      status: "success",
    };
  } catch (error) {
    console.error(error);
    return {
      title: "Something went wrong.",
      description: "There was a problem with creating new list.",
      status: "error",
    };
  }
};

export const renameList = async (listId: string, newName: string) => {
  try {
    const list = await db.list.update({
      where: { id: listId },
      data: { name: newName },
    });

    await updateWorkspaceTimestamp(list.workspaceId);

    revalidatePath(WORKSPACE_URL, "page");
    return {
      title: "List renamed successfully.",
      status: "success",
    };
  } catch (error) {
    console.error(error);
    return {
      title: "Something went wrong.",
      description: "There was a problem with renaming list.",
      status: "error",
    };
  }
};

export const reorderList = async (reorderedList: ListWithCards[]) => {
  try {
    const updatedOrder = reorderedList.map((list, index) =>
      db.list.update({
        where: { id: list.id },
        data: { order: index + 1 },
      })
    );

    await Promise.all(updatedOrder);

    if (reorderList.length > 0) {
      await updateWorkspaceTimestamp(reorderedList[0].workspaceId);
    }

    revalidatePath(WORKSPACE_URL, "page");
    return {
      title: "List reorder successfully.",
      status: "success",
    };
  } catch (error) {
    console.error(error);
    return {
      title: "Something went wrong.",
      description: "There was problem with reordering the list.",
      status: "error",
    };
  }
};

export const moveList = async (
  srcWorkspaceId: string,
  srcListOrder: number,
  destWorkspaceId: string,
  destListOrder: number
) => {
  try {
    const targetList: { id: string } | null = await db.list.findFirst({
      where: { workspaceId: srcWorkspaceId, order: srcListOrder },
      select: { id: true },
    });
    if (targetList) {
      const listId = targetList.id;
      if (srcWorkspaceId !== destWorkspaceId) {
        await db.list.updateMany({
          where: { workspaceId: srcWorkspaceId, order: { gt: srcListOrder } },
          data: { order: { decrement: 1 } },
        });
        await db.list.updateMany({
          where: {
            workspaceId: destWorkspaceId,
            order: { gte: destListOrder },
          },
          data: { order: { increment: 1 } },
        });
        await db.list.update({
          where: { id: listId },
          data: { workspaceId: destWorkspaceId, order: destListOrder },
        });
      } else {
        if (srcListOrder > destListOrder) {
          await db.list.updateMany({
            where: {
              workspaceId: destWorkspaceId,
              order: { gte: destListOrder, lt: srcListOrder },
            },
            data: { order: { increment: 1 } },
          });
        } else if (srcListOrder < destListOrder) {
          await db.list.updateMany({
            where: {
              workspaceId: destWorkspaceId,
              order: { gt: srcListOrder, lte: destListOrder },
            },
            data: { order: { decrement: 1 } },
          });
        }
        await db.list.update({
          where: { id: listId },
          data: { order: destListOrder },
        });
      }
    }
    revalidatePath(WORKSPACE_URL, "page");
    return {
      title: "List moved.",
      status: "success",
    };
  } catch (error) {
    console.error(error);
    return {
      title: "Something went wrong.",
      description: "There was problem with moving the list.",
      status: "error",
    };
  }
};

export const copyList = async (listId: string, newListname : string) => {
  try {
    const srcList = await db.list.findFirst({
      where: { id: listId },
      include: { cards: true },
    });
    if (srcList) {
      await db.list.updateMany({
        where: {
          workspaceId: srcList.workspaceId,
          order: { gt: srcList.order },
        },
        data: { order: { increment: 1 } },
      });
      const newList = await db.list.create({
        data: {
          name: newListname,
          order: srcList.order + 1,
          workspaceId: srcList.workspaceId,
        },
      });
    if (srcList.cards && srcList.cards.length > 0) {
        const cardPromises = srcList.cards.map((card) =>
          db.card.create({
            data: {
              title: card.title,
              description: card.description,
              status: card.status,
              order: card.order,
              listId: newList.id,             },
          })
        );

        await Promise.all(cardPromises);
      }
    }
    revalidatePath(WORKSPACE_URL, "page");
    return {
      title: "List copied.",
      status: "success",
    };
  } catch (error) {
    console.error(error);
    return {
      title: "Something went wrong.",
      description: "There was problem with copying the list.",
      status: "error",
    };
  }
};

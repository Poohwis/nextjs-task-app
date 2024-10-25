"use server";
import { db } from "@/lib/db";
import { Card } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { WORKSPACE_URL } from "@/lib/constant";
import { updateWorkspaceTimestamp } from "./workspace-action";

export const createCard = async (title: string, listId: string) => {
  try {
    const cardCount = await db.card.count({ where: { listId } });

    await db.card.create({
      data: { title, order: cardCount + 1, listId },
    });

    const list = await db.list.findUnique({
      where: { id: listId },
      select: { workspaceId: true },
    });

    if (list?.workspaceId) {
      await updateWorkspaceTimestamp(list.workspaceId);
    }

    revalidatePath(WORKSPACE_URL, "page");
    return {
      title: "Card created successfully.",
      status: "success",
    };
  } catch (error) {
    console.error(error);
    return {
      title: "Something went wrong.",
      description: "There was a problem with creating new card.",
      status: "error",
    };
  }
};

export const reorderCard = async (reorderedCard: Card[], listId: string) => {
  try {
    const updatedOrder = reorderedCard.map((card, index) =>
      db.card.update({
        where: { id: card.id },
        data: { order: index + 1, listId },
      })
    );

    await Promise.all(updatedOrder);

    const list = await db.list.findUnique({
      where: { id: listId },
      select: { workspaceId: true },
    });

    if (list?.workspaceId) {
      await updateWorkspaceTimestamp(list.workspaceId);
    }

    revalidatePath(WORKSPACE_URL, "page");
    return {
      title: "Card reorder successfully.",
      status: "success",
    };
  } catch (error) {
    console.error(error);
    return {
      title: "Something went wrong.",
      description: "There was a problem with reordering the cards.",
      status: "error",
    };
  }
};

export const editCardTitle = async (cardId: string, updatedTitle: string) => {
  try {
    const updatedCard = await db.card.update({
      where: { id: cardId },
      data: { title: updatedTitle },
    });

    revalidatePath(WORKSPACE_URL, "page");
    return { title: "Card rename successfully.", status: "success" };
  } catch (error) {
    console.error(error);
    return {
      title: "Something went wrong.",
      description: "There was a problem with renaming card title.",
      status: "error",
    };
  }
};

export const editCardDescription = async (cardId : string , updatedDescription : string) =>{
  try {
    await db.card.update({where : {id : cardId}, data :{description : updatedDescription}})
    revalidatePath(WORKSPACE_URL, "page");
    return { title: "Card description updated.", status: "success" };
  } catch (error) {
    console.error(error);
    return {
      title: "Something went wrong.",
      description: "There was a problem with changing card description.",
      status: "error",
    };
    
  }

}

export const moveCard = async (
  cardId: string,
  srcListId: string,
  destListId: string,
  srcOrder: number,
  destOrder: number
) => {
  try {
    if (srcListId !== destListId) {
      await db.card.updateMany({
        where: { listId: srcListId, order: { gt: srcOrder } },
        data: { order: { decrement: 1 } },
      });
      await db.card.updateMany({
        where: { listId: destListId, order: { gte: destOrder } },
        data: { order: { increment: 1 } },
      });
      await db.card.update({
        where: { id: cardId },
        data: { listId: destListId, order: destOrder },
      });
    } else {
      if (srcOrder < destOrder) {
        await db.card.updateMany({
          where: { listId: srcListId, order: { gt: srcOrder, lte: destOrder } },
          data: { order: { decrement: 1 } },
        });
      } else if (srcOrder > destOrder) {
        await db.card.updateMany({
          where: { listId: srcListId, order: { lt: srcOrder, gte: destOrder } },
          data: { order: { increment: 1 } },
        });
      }
      await db.card.update({
        where: { id: cardId },
        data: { order: destOrder },
      });
    }

    revalidatePath(WORKSPACE_URL, "page");
    return { title: "Card has been moved.", status: "success" };
  } catch (error) {
    console.error(error);
    return {
      title: "Something went wrong.",
      description: "There was a problem with moving the card.",
      status: "error",
    };
  }
};

export const copyCard = async (
  title: string,
  destListId: string,
  order: number,
  description?: string,
  status?: string
) => {
  try {
    await db.card.updateMany({
      where: { listId: destListId, order: { gte: order } },
      data: { order: { increment: 1 } },
    });
    await db.card.create({
      data: { title, order, listId: destListId, description, status },
    });
    revalidatePath(WORKSPACE_URL, "page");
    return { title: "Card has been copied.", status: "success" };
  } catch (error) {
    console.error(error);
    return {
      title: "Something went wrong.",
      description: "There was a problem with copying the card.",
      status: "error",
    };
  }
};


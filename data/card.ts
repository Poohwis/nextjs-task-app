import { db } from "@/lib/db";

export async function getCardByListId(
  userId: string,
  workspaceId: string,
  listId: string
) {
  const cards = await db.card.findMany({
    where: {
      list: {
        workspaceId,
        workspace: { userId },
      },
      listId
    },
    orderBy: { order: "asc" },
  });

  return cards;
}

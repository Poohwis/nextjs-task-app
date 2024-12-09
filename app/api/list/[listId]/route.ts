import { db } from "@/lib/db";
import { NextRequest , NextResponse } from "next/server";

interface IParams {
  listId: string;
}
export async function GET(
  req: NextRequest,
  { params }: { params: IParams }
) {
  const { listId } = params;
  const cards = await db.card.findMany({
    where: { listId },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(cards);
}

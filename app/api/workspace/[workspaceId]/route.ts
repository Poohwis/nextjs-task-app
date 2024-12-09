import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface IParams {
  workspaceId: string;
}
export async function GET(
  req: NextRequest,
  { params }: { params: IParams }
) {
  const session = await auth();
  const userId = session?.user?.id;
  const { workspaceId } = params;

  const { searchParams } = new URL(req.url || "");
  const isCount = searchParams.get("t") === "c";

  if (isCount) {
    const count = await db.list.count({ where: { workspaceId } });
    return NextResponse.json(count);
  }
  const list = await db.list.findMany({
    where: { workspaceId },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(list);
}

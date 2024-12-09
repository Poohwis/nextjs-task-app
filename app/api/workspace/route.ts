import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextRequest ,NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;

  // const {searchParams} = new URL(req.url)
  // const withList = !!searchParams.get("withlist") 

  const workspaces = await db.workspace.findMany({
    where: { userId, isClosed: false },
    // include : {lists : withList}
  });

  return NextResponse.json(workspaces);
}

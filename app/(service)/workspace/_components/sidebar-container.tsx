import { auth } from "@/auth";
import { getWorkspacesById } from "@/data/workspace";
import { notFound } from "next/navigation";
import SidebarComponent from "./sidebar-component";

export default async function SidebarContainer() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    notFound();
  }
  const workspaces = (await getWorkspacesById(userId, "default")) || [];
  return <SidebarComponent workspaces={workspaces} />;
}

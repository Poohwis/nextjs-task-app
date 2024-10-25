import { auth } from "@/auth";
import {
  getListsById,
} from "@/data/list";
import { notFound } from "next/navigation";
import ListSection from "./list-section";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface ListWrapperProps {
workspaceId : string
}
export default async function ListWrapper({
  workspaceId
}: ListWrapperProps) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    notFound();
  }
  const { isClosed ,lists } = await getListsById(userId, workspaceId);
  return (
    <ScrollArea className="h-full">
      <ListSection lists={lists} workspaceId={workspaceId} isClosed={isClosed} />
      <ScrollBar orientation="horizontal" forceMount  />  
    </ ScrollArea>
  );
}

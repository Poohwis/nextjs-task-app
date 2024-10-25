"use client";

import { Workspace } from "@prisma/client";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { usePathname } from "next/navigation";
import WorkspaceItem from "./workspace-item";
import { startTransition, useOptimistic } from "react";
import { reorderWorkspace } from "@/actions/workspace-action";
import { useSession } from "next-auth/react";
import { WORKSPACE_URL } from "@/lib/constant";

interface WorkspaceListsProps {
  workspaces: Workspace[];
}
export default function WorkspaceLists({ workspaces }: WorkspaceListsProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [optimisticWorkspace, setOptimisticWorkspace] =
    useOptimistic(workspaces);

  const [, currentWorkspaceId] =
    pathname.match(new RegExp(`${WORKSPACE_URL}\/([^\/]+)`)) || [];

  const reorder = (list: Workspace[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };
  const onDragEnd = async (result: any) => {
    const { destination, source } = result;
    if (!result.destination) return;

    //dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    //MOVED
    const reorderedWorkspace = reorder(
      optimisticWorkspace,
      source.index,
      destination.index
    );

    if (!session || !session.user) {
      return { message: "User not authenticated", statas: "error" };
    }
    const userId = session.user.id;
    startTransition(async () => {
      setOptimisticWorkspace(reorderedWorkspace);
      const result = await reorderWorkspace(userId!, reorderedWorkspace);
      if (result.status === "success") {
        // router.push() go to lastest workspace
      }
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex flex-col"
          >
            {optimisticWorkspace.map((workspace, index) => (
              <WorkspaceItem
                key={workspace.id}
                workspace={workspace}
                currentWorkspaceId={currentWorkspaceId}
                index={index}
              />
            ))}
            {provided.placeholder}
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
}

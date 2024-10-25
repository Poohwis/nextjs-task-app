"use client";
import { Card, List } from "@prisma/client";
import ListAddButton from "./list-add-button";
import { startTransition, useEffect, useOptimistic, useState } from "react";
import ListItem from "./list-item";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import ListAddItem from "./list-add-item";
import { useSession } from "next-auth/react";
import { IsUserWorkspaceAuthorized } from "@/actions/owner-action";
import { reorderList } from "@/actions/list-action";
import { notFound } from "next/navigation";
import { reorderCard } from "@/actions/card-action";

export type ListWithCards = List & { cards: Card[] };
interface ListSectionProps {
  lists: ListWithCards[];
  workspaceId: string;
  isClosed: boolean;
}

export default function ListSection({
  lists,
  workspaceId,
  isClosed,
}: ListSectionProps) {
  const { data: session } = useSession();
  const [isAdding, setIsAdding] = useState(false);
  const [optimisticLists, setOptimisticLists] = useOptimistic(lists);
  const isPreviousList = !lists.length;

  function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  }

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;
    if (!result.destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === "list") {
      const reorderedList = reorder(
        optimisticLists,
        source.index,
        destination.index
      );
      const userId = session?.user?.id;
      startTransition(async () => {
        setOptimisticLists(reorderedList);
        const isAuthorized = await IsUserWorkspaceAuthorized(
          userId!,
          workspaceId
        );
        if (isAuthorized) {
          const result = await reorderList(reorderedList);
          if (result.status === "success") {
            return;
          }
        } else {
          notFound();
        }
      });
    }
    if (type === "card") {
      const sourceListIndex = optimisticLists.findIndex(
        (list) => list.id === source.droppableId
      );
      const destinationListIndex = optimisticLists.findIndex(
        (list) => list.id === destination.droppableId
      );

      if (sourceListIndex === -1 || destinationListIndex === -1) return;

      const sourceList = optimisticLists[sourceListIndex];
      const destinationList = optimisticLists[destinationListIndex];

      if (!sourceList.cards) {
        sourceList.cards = [];
      }
      if (!destinationList.cards) {
        destinationList.cards = [];
      }

      //move to same list
      if (sourceList.id === destinationList.id) {
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        );
        const updatedList = { ...sourceList, cards: reorderedCards };
        const updatedLists = optimisticLists.map((list, index) =>
          index === sourceListIndex ? updatedList : list
        );

        const userId = session?.user?.id;
        startTransition(async () => {
          setOptimisticLists(updatedLists);
          const isAuthorized = await IsUserWorkspaceAuthorized(
            userId!,
            workspaceId
          );
          if (isAuthorized) {
            const result = await reorderCard(reorderedCards, updatedList.id);
            if (result.status === "success") {
              //TODO ; toast
              return;
            } else {
              notFound();
            }
          }
        });
      }
      //move to different list
      else {
        const sourceCards = Array.from(sourceList.cards);
        const destinationCards = Array.from(destinationList.cards);
        const [movedCard] = sourceCards.splice(source.index, 1);
        destinationCards.splice(destination.index, 0, movedCard);

        const updatedSourceList = { ...sourceList, cards: sourceCards };

        const updatedDestinationList = {
          ...destinationList,
          cards: destinationCards,
        };

        const updatedLists = optimisticLists.map((list, index) => {
          if (index === sourceListIndex) {
            return updatedSourceList;
          } else if (index === destinationListIndex) {
            return updatedDestinationList;
          } else {
            return list;
          }
        });

        const userId = session?.user?.id;
        startTransition(async () => {
          setOptimisticLists(updatedLists);
          const isAuthorized = await IsUserWorkspaceAuthorized(
            userId!,
            workspaceId
          );
          if (isAuthorized) {
            const resultSource = await reorderCard(
              updatedSourceList.cards,
              sourceList.id
            );
            const resultDestination = await reorderCard(
              updatedDestinationList.cards,
              destinationList.id
            );
            const result = resultDestination && resultSource;
            if (result.status === "success") {
              //TODO ; toast
              return;
            } else {
              notFound();
            }
          }
        });
      }
    }
  };

  return (
    <div className="flex flex-row items-start mt-4 mx-2">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="lists" type="list" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              className="flex flex-row items-start"
              {...provided.droppableProps}
            >
              {optimisticLists.map((list, index) => (
                <ListItem
                  key={list.id}
                  index={index}
                  isAdding={isAdding}
                  workspaceId={workspaceId}
                  data={list}
                  isClosed={isClosed}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {!isClosed &&
        (isAdding ? (
          <ListAddItem
            isAdding={isAdding}
            setIsAdding={setIsAdding}
            workspaceId={workspaceId}
          />
        ) : (
          <ListAddButton
            isAdding={isAdding}
            setIsAdding={setIsAdding}
            isPreviousList={isPreviousList}
          />
        ))}
    </div>
  );
}

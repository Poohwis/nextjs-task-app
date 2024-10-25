"use client";

import { renameList } from "@/actions/list-action";
import { IsUserWorkspaceAuthorized } from "@/actions/owner-action";
import { cn } from "@/lib/utils";
import { Card, List } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRef, useState, useTransition } from "react";
import CardContainer from "./card-container";
import { notFound } from "next/navigation";
import { Draggable } from "@hello-pangea/dnd";
import ListOption from "./list-option";
import { MAXLENGTH_LISTNAME } from "@/lib/constant";

interface ListItemProps {
  isAdding: boolean;
  workspaceId: string;
  data: List & { cards: Card[] };
  index: number;
  isClosed: boolean;
}
export default function ListItem({
  isAdding,
  workspaceId,
  data,
  index,
  isClosed,
}: ListItemProps) {
  const { data: session } = useSession();
  const [isEditting, setIsEditing] = useState(false);
  const [listName, setListName] = useState(data.name);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const isTitleChanged = data.name !== listName && listName.length !== 0;

  const handleRenameList = () => {
    const userId = session?.user?.id;
    startTransition(async () => {
      const isAuthorized = await IsUserWorkspaceAuthorized(
        userId!,
        workspaceId
      );
      if (isAuthorized) {
        await renameList(data.id, listName);
      } else {
        notFound();
      }
    });
  };

  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.relatedTarget === addButtonRef.current) return;
    if (!listName) {
      setListName(data.name);
    }
    if (isTitleChanged) {
      handleRenameList();
      inputRef.current?.blur();
      return;
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (!listName) {
        setListName(data?.name!);
        inputRef.current?.blur();
      }
      if (isTitleChanged) {
        handleRenameList();
        inputRef.current?.blur();
        return;
      }
      inputRef.current?.blur();
    }
  };

  const onTitleClick = () => {
    if (isClosed) return;
    inputRef.current?.focus();
    inputRef.current?.setSelectionRange(data.name.length, data.name.length);
  };

  return (
    <Draggable draggableId={data.id} index={index} isDragDisabled={isClosed}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          className={cn(
            "flex mx-1 flex-col rounded-md w-[270px] px-1 pt-1 pb-2 bg-black max-h-[calc(100vh-10vh)]"
          )}
        >
          <div
            {...provided.dragHandleProps}
            className="relative z-10 mt-1 mb-2 mx-1 flex flex-row items-center gap-x-2"
          >
            <div
              onClick={onTitleClick}
              className={cn(
                "absolute w-full h-8 bg-transparent",
                isClosed ? "hover:cursor-default" : "hover:cursor-pointer"
              )}
            />
            <input
              ref={inputRef}
              maxLength={MAXLENGTH_LISTNAME}
              type="text"
              value={isEditting ? listName : data.name}
              onBlur={onBlur}
              onKeyDown={onKeyDown}
              onFocus={() => setIsEditing(true)}
              onChange={(e) => setListName(e.target.value)}
              className={cn(
                "w-full hover:cursor-pointer h-8 text-xs font-semibold pl-2 text-white rounded-sm focus-visible:outline-none bg-transparent focus-visible:ring-white/20 ring-1 ring-transparent"
              )}
              placeholder="Enter list title..."
            />
            <ListOption data={data} workspaceId={workspaceId} />
          </div>
          <CardContainer
            cards={data.cards}
            workspaceId={workspaceId}
            listId={data?.id}
            listName={data.name}
            isClosed={isClosed}
          />
        </div>
      )}
    </Draggable>
  );
}

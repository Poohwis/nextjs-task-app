"use client";

import { createList } from "@/actions/list-action";
import { IsUserWorkspaceAuthorized } from "@/actions/owner-action";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState, useTransition } from "react";
import CreateButtonGroup from "./create-button-group";
import { notFound } from "next/navigation";
import { MAXLENGTH_LISTNAME } from "@/lib/constant";

interface ListAddItemProps {
  isAdding: boolean;
  setIsAdding: (state: boolean) => void;
  workspaceId: string;
}
export default function ListAddItem({
  isAdding,
  setIsAdding,
  workspaceId,
}: ListAddItemProps) {
  const { data: session } = useSession();
  const [listName, setListName] = useState("");
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isAdding) {
      inputRef.current?.focus();
    }
  }, [inputRef]);

  const handleCreateList = () => {
    if (listName.trim() === "") {
      inputRef.current?.focus();
      return;
    }
    const userId = session?.user?.id;
    startTransition(async () => {
      const isAuthorized = await IsUserWorkspaceAuthorized(
        userId!,
        workspaceId
      );
      if (isAuthorized) {
        const result = await createList(listName, workspaceId);
        if (result.status === "success") {
          setListName("")
          return;
        }
      } else {
        notFound();
      }
    });
  };

  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.relatedTarget === addButtonRef.current) return;
    if (!listName) {
      setListName("");
    }
      setIsAdding(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (!listName) {
        setListName("");
         inputRef.current?.blur();
        
      }
        handleCreateList();
    }
  };
  const handleCancelAddList = () => {
    setIsAdding(false);
  };

  return (

    <div className="ml-2 flex flex-col gap-y-2 rounded-md w-[270px] bg-black px-2 py-2  ">
      <input
        ref={inputRef}
        maxLength={MAXLENGTH_LISTNAME}
        type="text"
        value={listName}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        onChange={(e) => setListName(e.target.value)}
        className={cn(
          "hover:cursor-pointer h-8 text-xs font-semibold pl-2 text-white rounded-sm focus-visible:outline-none bg-transparent focus-visible:ring-white/20 ring-1 ring-transparent"
        )}
        placeholder="Enter list title..."
      />
        <CreateButtonGroup
          addButtonRef={addButtonRef}
          action={handleCreateList}
          closeAction={handleCancelAddList}
        >
          Add list
        </CreateButtonGroup>
    </div>
  );
}

import TextareaAutosize from "react-textarea-autosize";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DialogPosition } from "./card-item";
import { startTransition, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { IsUserWorkspaceAuthorized } from "@/actions/owner-action";
import { editCardTitle } from "@/actions/card-action";
import { Card } from "@prisma/client";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { WORKSPACE_URL } from "@/lib/constant";

interface CardDialogTextareaProps {
  textEditPosition: DialogPosition;
  data: Card;
  workspaceId: string;
  setIsDialogOpen: (state: boolean) => void;
  setOptimisticCards: (cards: any) => void;
}
export default function CardDialogTextarea({
  textEditPosition,
  data,
  workspaceId,
  setIsDialogOpen,
  setOptimisticCards,
}: CardDialogTextareaProps) {
  const { data: session } = useSession();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [cardTitle, setCardTitle] = useState(data.title);

  const handleEditCardTitle = async () => {
    if (cardTitle.trim() === "") {
      setIsDialogOpen(false);
      return;
    }

    const userId = session?.user?.id;
    startTransition(async () => {
      setOptimisticCards((prevCards: Card[]) =>
        prevCards.map((card) =>
          card.id === data.id ? { ...card, title: cardTitle } : card
        )
      );
      const isAuthorized = await IsUserWorkspaceAuthorized(
        userId!,
        workspaceId
      );
      if (isAuthorized) {
        const result = await editCardTitle(data.id, cardTitle);
        if (result.status === "success") {
          setIsDialogOpen(false);
          return;
        } else {
          revalidatePath(WORKSPACE_URL, "page");
        }
      } else {
        notFound();
      }
    });
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleEditCardTitle();
    }
  };
  return (
    <div
      className="fixed z-50 flex flex-col items-start"
      style={{
        top: textEditPosition.top,
        left: textEditPosition.left,
        width: textEditPosition.width,
      }}
    >
      <TextareaAutosize
        ref={textareaRef}
        value={cardTitle}
        minRows={3}
        maxRows={7}
        onChange={(e) => setCardTitle(e.target.value)}
        onKeyDown={onKeyDown}
        className={cn(
          "hover:cursor-pointer text-xs font-normal pl-2 w-full text-white rounded-md focus-visible:outline-none",
          "bg-darkgray ring-1 ring-transparent",
          "align-text-top text-left pt-2 px-2 pb-4 resize-none overflow-hidden"
        )}
      />
      <Button
        size={"sm"}
        variant={"blue"}
        className="text-xs mt-1 h-8"
        onClick={handleEditCardTitle}
      >
        Save
      </Button>
    </div>
  );
}

import { createCard } from "@/actions/card-action";
import { IsUserWorkspaceAuthorized } from "@/actions/owner-action";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { notFound } from "next/navigation";
import {
  useState,
  useRef,
  useEffect,
  startTransition,
  useTransition,
} from "react";
import TextareaAutosize from "react-textarea-autosize";
import CreateButtonGroup from "./create-button-group";
import { Card } from "@prisma/client";
interface CardAddAreaProps {
  listId?: string;
  workspaceId: string;
  isAddingCard: boolean;
  scrollToBottom: () => void;
  handleToggleAddingCard: () => void;
}
export default function fCardAddArea({
  scrollToBottom,
  workspaceId,
  listId,
  handleToggleAddingCard,
  isAddingCard,
}: CardAddAreaProps) {
  const { data: session } = useSession();
  const [cardName, setCardName] = useState("");
  const [isPending , startTransition] = useTransition()
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isAddingCard) {
      requestAnimationFrame(() => {
        textareaRef.current?.focus();
        requestAnimationFrame(() => {
          scrollToBottom();
        });
      });
    }
  }, [isAddingCard, scrollToBottom]);

  const handleCreateCard = () => {
    if (cardName.trim() === "") {
      handleToggleAddingCard();
      return;
    }

    const userId = session?.user?.id;
    startTransition(async () => {
      const isAuthorized = await IsUserWorkspaceAuthorized(
        userId!,
        workspaceId
      );
      if (isAuthorized) {
        const result = await createCard(cardName, listId!);
        if (result.status === "success") {
          // handleToggleAddingCard()
          setCardName("");
          return;
        }
      } else {
        notFound();
      }
    })
  };

  const onBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (e.relatedTarget === cancelButtonRef.current) return;
    if (e.relatedTarget === addButtonRef.current) return;
    handleCreateCard();
    handleToggleAddingCard();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCreateCard();
    }
  };

  const handleCancelAddCard = () => {
    setCardName("");
    handleToggleAddingCard();
  };
  return (
    <>
      <TextareaAutosize
        minRows={3}
        maxRows={7}
        ref={textareaRef}
        placeholder="Enter a name for this card..."
        disabled={isPending}
        value={cardName}
        onChange={(e) => setCardName(e.target.value)}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        className={cn(
          "hover:cursor-pointer text-xs font-normal pl-2 text-white rounded-md focus-visible:outline-none",
          "bg-darkgray ring-1 ring-transparent",isPending ? "" : "",
          "align-text-top text-left pt-2 px-2 pb-4 resize-none overflow-hidden"
        )}
      />
      <CreateButtonGroup
        addButtonRef={addButtonRef}
        cancelButtonRef={cancelButtonRef}
        closeAction={handleCancelAddCard}
        action={handleCreateCard}
      >
        Add card
      </CreateButtonGroup>
    </>
  );
}

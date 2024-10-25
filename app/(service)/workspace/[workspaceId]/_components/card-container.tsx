import { Card } from "@prisma/client";
import CardAddButton from "./card-add-button";
import CardItem from "./card-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useOptimistic, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import CardAddArea from "./card-add-area";
import { Droppable } from "@hello-pangea/dnd";

interface CardContainerProps {
  cards?: Card[];
  workspaceId: string;
  listId?: string;
  listName : string
  isClosed: boolean;
}
export default function CardContainer({
  cards,
  workspaceId,
  listId,
  listName,
  isClosed,
}: CardContainerProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isAddingCard, setIsAddingCard] = useState(false);
  //TODO : card data optimistic update
  const [optimisticCards, setOptimisticCards] = useOptimistic(cards);

  const handleToggleAddingCard = () => {
    setIsAddingCard(!isAddingCard);
  };

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current?.scrollHeight;
    }
  };

  const isListEmpty = cards?.length === 0

  return (
    <>
      <ScrollArea ref={scrollAreaRef} className="w-full overflow-y-auto">
        <Droppable droppableId={listId!} type="card">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={cn("flex flex-col px-1 py-[1px] pt-1 gap-y-[6px]")}
            >
              {optimisticCards?.map((card, index) => (
                <CardItem
                  key={card.id}
                  data={card}
                  listName={listName}
                  index={index}
                  isClosed={isClosed}
                  workspaceId={workspaceId}
                  setOptimisticCards={setOptimisticCards}
                />
              ))}
              {isAddingCard && (
                <CardAddArea
                  isAddingCard={isAddingCard}
                  handleToggleAddingCard={handleToggleAddingCard}
                  listId={listId}
                  workspaceId={workspaceId}
                  scrollToBottom={scrollToBottom}
                />
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </ScrollArea>
      {!isClosed && !isAddingCard && (
    <div className={ cn( "px-1", isListEmpty ? "" : "mt-[5px]" ) }>
          <CardAddButton handleToggleAddingCard={handleToggleAddingCard} />
    </div>
      )}
    </>
  );
}

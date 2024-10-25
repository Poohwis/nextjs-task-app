import { cn } from "@/lib/utils";
import { Draggable } from "@hello-pangea/dnd";
import { Card } from "@prisma/client";
import { AlignCenter, AlignJustify, Pencil } from "lucide-react";
import { useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import CardDialog from "./card-dialog";
import CardDialogWrapper from "./card-dialog-wrapper";

export interface DialogPosition {
  top: number;
  left: number;
  width?: number;
}
interface CardItemProps {
  data: Card;
  listName: string;
  index: number;
  isClosed: boolean;
  workspaceId: string;
  setOptimisticCards: (cards: Card[]) => void;
}
export default function CardItem({
  data,
  listName,
  index,
  isClosed,
  workspaceId,
  setOptimisticCards,
}: CardItemProps) {
  const [optionPosition, setOptionPosition] = useState<DialogPosition>({
    top: 0,
    left: 0,
  });
  const [textEditPosition, setTextEditPosition] = useState<DialogPosition>({
    top: 0,
    left: 0,
    width: 0,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleEditCardClick = () => {
    if (cardRef.current) {
      const rectCard = cardRef.current.getBoundingClientRect();
      setOptionPosition({
        top: rectCard.top,
        left: rectCard.right,
      });
    }

    if (textareaRef.current) {
      const rectTextarea = textareaRef.current.getBoundingClientRect();
      setTextEditPosition({
        top: rectTextarea.top,
        left: rectTextarea.left,
        width: rectTextarea.width,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <Draggable draggableId={data.id} index={index} isDragDisabled={isClosed}>
        {(provided) => (
          <CardDialogWrapper
            data={data}
            workspaceId={workspaceId}
            listName={listName}
          >
            <div
              {...provided.dragHandleProps}
              {...provided.draggableProps}
              ref={(el) => {
                provided.innerRef(el);
                cardRef.current = el;
              }}
              className={cn(
                "group relative hover:cursor-pointer flex rounded-md items-start",
                "hover:brightness-125"
                // "hover:ring-2 hover:ring-white"
              )}
              onClick={() => {}}
            >
              <TextareaAutosize
                ref={textareaRef}
                value={data.title}
                maxRows={7}
                className={cn(
                  "hover:cursor-pointer text-xs min-h-8 text-wrap font-normal w-full pl-2 text-white rounded-md focus-visible:outline-none",
                  "bg-darkgray ring-1 ring-transparent",
                  "align-text-top text-left px-2 py-2 resize-none overflow-hidden",
                  "pointer-events-none", data.description ? "pb-6" : "" 
                )}
              />
              {!isClosed && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditCardClick();
                  }}
                  className="z-10 group-hover:opacity-100 opacity-0 absolute right-1 top-1 w-6 h-6 rounded-full flex items-center justify-center bg-darkgray hover:bg-black"
                >
                  <Pencil size={12} color="gray" />
                </div>
              )}
              {data.description && (
                <div className="flex items-end justify-center absolute left-2 bottom-2 h-full ">
                  <AlignJustify size={14} color="gray" />
                </div>
              )}
            </div>
          </CardDialogWrapper>
        )}
      </Draggable>
      {isDialogOpen && (
        <CardDialog
          data={data}
          optionPosition={optionPosition}
          textEditPosition={textEditPosition}
          handleCloseDialog={handleCloseDialog}
          setIsDialogOpen={setIsDialogOpen}
          workspaceId={workspaceId}
          setOptimisticCards={setOptimisticCards}
        />
      )}
    </>
  );
}

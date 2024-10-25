import { cn } from "@/lib/utils";
import { DialogPosition } from "./card-item";
import { useEffect, useRef, useState } from "react";
import { Card } from "@prisma/client";
import { Button } from "@/components/ui/button";
import CardDialogTextarea from "./card-dialog-textare";
import { ArrowRightLeft, Copy, LucideIcon, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import CardOptionMove from "./card-option-move";
import CardOptionCopy from "./card-option-copy";
import CardOptionPopover from "./card-option-popover";

interface CardDialogProps {
  data: Card;
  workspaceId: string;
  optionPosition: DialogPosition;
  textEditPosition: DialogPosition;
  handleCloseDialog: () => void;
  setIsDialogOpen: (state: boolean) => void;
  setOptimisticCards: (cards: Card[]) => void;
}
export default function CardDialog({
  handleCloseDialog,
  optionPosition,
  textEditPosition,
  data,
  workspaceId,
  setIsDialogOpen,
  setOptimisticCards,
}: CardDialogProps) {
  const optionRef = useRef<HTMLDivElement>(null);
  const [isRightSide, setIsRightSide] = useState<boolean | null>(null);
  const [activeOption, setActiveOption] = useState<number | null>(null);

  const optionWidth = 80;
  const calculatePosition = () => {
    const windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
    return windowWidth - optionPosition.left > optionWidth;
  };

  useEffect(() => {
    setIsRightSide(calculatePosition());

    const handleResize = () => {
      setIsRightSide(calculatePosition());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [optionPosition.left]);

  if (isRightSide === null) return null;
const togglePopover = (index: number) => {
    setActiveOption((prevIndex) => (prevIndex === index ? null : index));
  };

  const cardOptions = [
    {
      title: "Move",
      header: "Move card",
      icon: ArrowRightLeft,
      content: (
        <CardOptionMove
          workspaceId={workspaceId}
          data={data}
          setActiveOption={setActiveOption}
          setIsDialogOpen={setIsDialogOpen}
        />
      ),
    },
    {
      title: "Copy",
      header: "Copy card",
      icon: Copy,
      content: (
        <CardOptionCopy
          workspaceId={workspaceId}
          data={data}
          setActiveOption={setActiveOption}
          setIsDialogOpen={setIsDialogOpen}
        />
      ),
    },
  ];

  return (
    <>
      {/* backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 backdrop-brightness-50",
        )}
        onClick={() => {
          handleCloseDialog();
        }}
      />
      <div
        ref={optionRef}
        className={cn(
          "fixed z-50 flex flex-col gap-y-1 px-2",
          isRightSide ? "items-start" : "items-end "
        )}
        style={{
          top: optionPosition.top,
          left: isRightSide
            ? optionPosition.left
            : textEditPosition.left - optionWidth,
        }}
      >
        {cardOptions.map((option, index) => {
          const Icon = option.icon as LucideIcon
          return (
            <CardOptionPopover
              key={option.title}
              header={option.header}
              content={option.content}
              isOpen={activeOption === index}
              onOpenChange={(open) => setActiveOption(open ? index : null)}
              onToggle={() => togglePopover(index)}
            >
              <button
                className={cn(
                  "hover:cursor-pointer hover:brightness-125 text-xs font-normal rounded-sm",
                  "bg-darkgray px-2 gap-x-1 py-[6px] flex items-center justify-center text-white "
                )}
                onClick={() => togglePopover(index)}
              >
                {Icon && <Icon size={12} />}
                <span>{option.title}</span>
              </button>
            </CardOptionPopover>
          );
        })}
      </div>
      <CardDialogTextarea
        setIsDialogOpen={setIsDialogOpen}
        textEditPosition={textEditPosition}
        data={data}
        workspaceId={workspaceId}
        setOptimisticCards={setOptimisticCards}
      />
    </>
  );
}

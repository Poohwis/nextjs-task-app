import { editCardDescription, editCardTitle } from "@/actions/card-action";
import TextareaAutosize from "react-textarea-autosize";
import { IsUserWorkspaceAuthorized } from "@/actions/owner-action";
import {
  Dialog,
  DialogTitle,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Card } from "@prisma/client";
import { useSession } from "next-auth/react";
import { notFound } from "next/navigation";
import { startTransition, useEffect, useRef, useState } from "react";
import CardOptionPopover from "./card-option-popover";
import { ArrowRightLeft, Copy } from "lucide-react";
import CardOptionMove from "./card-option-move";
import CardOptionCopy from "./card-option-copy";

interface CardDialogWrapperProps {
  data: Card;
  listName: string;
  children: React.ReactNode;
  workspaceId: string;
}
export default function CardDialogWrapper({
  children,
  data,
  listName,
  workspaceId,
}: CardDialogWrapperProps) {
  const { data: session } = useSession();
  const [title, setTitle] = useState(data.title);
  const [description, setDescription] = useState(data.description);

  const handleChangeTitle = () => {
    const isTitleChanged = data.title !== title;
    if (!isTitleChanged ) return;
    if(title.length === 0){
      setTitle(data.title)
      return 
    }
    const userId = session?.user?.id;
    startTransition(async () => {
      const isAuthorized = await IsUserWorkspaceAuthorized(
        userId!,
        workspaceId
      );
      if (isAuthorized) {
        const result = await editCardTitle(data.id, title);
        if (result.status === "success") {
          return;
        }
      } else {
        notFound();
      }
    });
  };

  const onTitleBlur = () => {
    handleChangeTitle();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleChangeTitle();
    }
  };
  const [isOpen, setIsOpen] = useState(false);

  const cardOptions = [
    {
      title: "Move",
      header: "Move card",
      icon: ArrowRightLeft,
      content: (
        <CardOptionMove
          workspaceId={workspaceId}
          data={data}
          setIsOpen={setIsOpen}
        />
      ),
    },
    {
      title: "Copy",
      header: "Copy card",
      icon: Copy,
      content: <CardOptionCopy workspaceId={workspaceId} data={data} />,
    },
  ];
  const move = cardOptions[0];

  const handleChangeDescription = () => {
    const isDescriptionChange = data.description !== description;
    if (!isDescriptionChange || description === null) return;

    const userId = session?.user?.id;
    startTransition(async () => {
      const isAuthorized = await IsUserWorkspaceAuthorized(
        userId!,
        workspaceId
      );
      if (isAuthorized) {
        const result = await editCardDescription(data.id, description);
        if (result.status === "success") {
          return;
        }
      } else {
        notFound();
      }
    });
  };
  const onDescriptionBlur = () => {
    handleChangeDescription();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        aria-describedby={undefined}
        className="top-[10%]"
      >
        <DialogTitle className="hidden">{data.title}</DialogTitle>
        <div className="flex flex-col">
          <TextareaAutosize
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={onTitleBlur}
            onKeyDown={onKeyDown}
            className={cn(
              "bg-transparent focus-visible:outline-none w-[80%]",
              "resize-none", "text-white text-sm font-semibold "
            )}
          />
          <div className="flex flex-row gap-x-1 text-xs text-white/60 ">
            in list
            <CardOptionPopover
              content={move.content}
              header={move.header}
              isOpen={isOpen}
              onOpenChange={setIsOpen}
            >
              <div className="hover:cursor-pointer bg-darkgray px-1 rounded-sm hover:opacity-80 text-white">
                {listName}
              </div>
            </CardOptionPopover>
          </div>
        </div>

        <div className="flex flex-col text-white ">
          <div className="text-xs font-semibold">Description</div>
          <div className="relative">
            <TextareaAutosize
              // ref={textareaRef}
              value={description ? description : ""}
              onChange={(e) => setDescription(e.target.value)}
              // onClick={()=>setIsTextareaEditing(true)}
              // disabled={isTextareaEditing}
              onBlur={onDescriptionBlur}
              placeholder="Add description..."
              minRows={2}
              maxRows={4}
              className={cn(
                "text-xs min-h-8 mt-1 text-wrap font-normal w-full pl-2 text-white rounded-md focus-visible:outline-none",
                "bg-darkgray ring-1 ring-transparent",
                "align-text-top text-left px-2 py-2 resize-none overflow-hidden"
              )}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

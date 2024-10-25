import { copyList } from "@/actions/list-action";
import { IsUserWorkspaceAuthorized } from "@/actions/owner-action";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { MAXLENGTH_LISTNAME } from "@/lib/constant";
import { cn } from "@/lib/utils";
import { List } from "@prisma/client";
import { useSession } from "next-auth/react";
import { notFound } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import TextareaAutosize from "react-textarea-autosize";

interface ListOptionCopyProps {
  data: List;
}
export default function ListOptionCopy({ data }: ListOptionCopyProps) {
  const {data : session} = useSession()
  const [listName, setListName] = useState(data.name);
  const [isPending, startTransition] = useTransition()
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const {toast} = useToast()

  useEffect(() => {
    textareaRef.current?.focus();
    textareaRef.current?.select();
  }, []);

  const onSubmit = ()=> {
    console.log("here")
    const userId = session?.user?.id;
    startTransition(async () => {
      const isAuthorized = await IsUserWorkspaceAuthorized(
        userId!,
        data.workspaceId
      );
      if (isAuthorized) {
        const result = await copyList(data.id, listName);
        if (result.status === "success") {
          toast({title: "List copied.",variant :"dark"})
          return;
        }
      } else {
        notFound();
      }
    });
  }

  return (
    <div className="px-4">
      <div className="flex flex-col">
        <TextareaAutosize
          ref={textareaRef}
          maxLength={MAXLENGTH_LISTNAME}
          minLength={1}
          value={listName}
          onChange={(e) => {
            setListName(e.target.value);
          }}
          onKeyDown={() => {}}
          className={cn(
            "hover:cursor-pointer text-xs font-normal pl-2 text-white rounded-md focus-visible:outline-none",
            "bg-darkgray ring-1 ring-white/80",
            " text-left  px-2 py-2 resize-none overflow-hidden"
          )}
        />
        <Button
          onClick={onSubmit}
          variant={"blue"}
          size={"sm"}
          className="text-xs mt-4 w-full"
        >
          Create list
        </Button>
      </div>
    </div>
  );
}

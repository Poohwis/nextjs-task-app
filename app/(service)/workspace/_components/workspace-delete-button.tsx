"use client";

import { deleteWorkspace } from "@/actions/workspace-action";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import { PopoverClose } from "@radix-ui/react-popover";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

interface WorkspaceDeleteButtonProps {
    workspaceId : string
}
export default function WorkspaceDeleteButton({workspaceId} : WorkspaceDeleteButtonProps) {
  const { data: session } = useSession();

  const handleDeleteWorkspace = async () => {
    const userId = session?.user?.id;
    if (!userId) {
      //TODO : maybe change this to redirect to error page with dynamic error specify
      redirect("/");
    }
    const result = await deleteWorkspace(workspaceId, userId);
    if (result.status === "success") {
      toast({ title: result.title, variant: "dark" });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="destructive" className="text-xs">
          Delete
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="flex flex-col ">
        <div className="flex flex-row justify-center">
          <div className="font-semibold text-xs">Delete workspace?</div>
          <PopoverClose asChild className="absolute right-4">
            <X size={14} color="gray" className="hover:cursor-pointer" />
          </PopoverClose>
        </div>
        <div className="text-xs text-white/80 mt-2">
          All data contain in this workspace will be deleted, you won&apos;t be able
          to re-open the workspace.
        </div>
            <Button
              variant={"destructive"}
              className="text-xs mt-4 h-8"
              onClick={handleDeleteWorkspace}
            >
            Delete
            </Button>
      </PopoverContent>
    </Popover>
  );
}

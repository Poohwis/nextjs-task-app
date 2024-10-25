"use client";
import { reopenWorkspace } from "@/actions/workspace-action";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

interface WorkspaceClosedBanner {
  workspaceId: string;
}
export default function WorkspaceClosedBanner({
  workspaceId,
}: WorkspaceClosedBanner) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const userId = session?.user?.id;

  const handleReopenWorkspace = async () => {
    if (!userId) {
      redirect("/");
    }
    const result = await reopenWorkspace(userId, workspaceId);
    if (result.status === "success") {
      toast({
        title: result.title,
        description: result.description,
        variant: "dark",
      });
    }
  };
  return (
    <div className=" text-xs text-white/80 py-2 bg-darkgray w-full flex justify-center ">
      This workspace is closed. Reopen the workspace to make changes.&nbsp;
      <span
        className="underline hover:cursor-pointer hover:text-white "
        onClick={handleReopenWorkspace}
      >
        Reopen workspace
      </span>
    </div>
  );
}

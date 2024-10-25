"use client";

import { reopenWorkspace } from "@/actions/workspace-action";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { WORKSPACE_URL } from "@/lib/constant";
import { ArrowUpRight } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface WorkspaceReopenButtonProps {
  workspaceId: string;
}
export default function WorkspaceReopenButton({
  workspaceId,
}: WorkspaceReopenButtonProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const handleWorkspaceReopen = async () => {
    const userId = session?.user?.id;
    if (!userId) {
      redirect("/");
    }
    const result = await reopenWorkspace(userId, workspaceId);
    if (result.status === "success") {
      toast({
        title: result.title,
        description: result.description,
        variant: "dark",
        action: (
          <Link href={`${WORKSPACE_URL}/${workspaceId}`}>
            <ToastAction altText="Go to workspace">
              <ArrowUpRight size={14} />
            </ToastAction>
          </Link>
        ),
      });
    }
  };
  return (
    <Button
      onClick={handleWorkspaceReopen}
      size="sm"
      variant="confirm"
      className="text-xs"
    >
      Reopen
    </Button>
  );
}

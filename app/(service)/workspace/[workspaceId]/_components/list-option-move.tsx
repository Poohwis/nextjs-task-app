import { moveList } from "@/actions/list-action";
import { IsUserWorkspaceAuthorized } from "@/actions/owner-action";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";
import { List, Workspace } from "@prisma/client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { notFound } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

interface ListOptionMoveProps {
  data: List;
}
export default function ListOptionMove({
  data,
}: ListOptionMoveProps) {
  const { data: session } = useSession();
  const [selectedWorkspace, setSelectWorkspace] = useState(data.workspaceId);
  const [selectedPosition, setSelectedPosition] = useState(data.order);
  const [workspaceSelectList, setWorkspaceSelectList] = useState([]);
  const [positionSelectCount, setPositionSelectCount] = useState(0);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  useEffect(() => {
    fetchListCount();
  }, [selectedWorkspace]);

  const fetchWorkspaces = () => {
    axios
      .get(`/api/workspace`)
      .then((res) => {
        const workspaceList = res.data.map((workspace: Workspace) => ({
          name: workspace.name,
          id: workspace.id,
        }));
        setWorkspaceSelectList(workspaceList);
      })
      .catch(() => toast({ title: "Something went wrong" , variant : "destructive" }));
  };

  const fetchListCount = () => {
    axios
      .get(`/api/workspace/${selectedWorkspace}?t=c`)
      .then((res) => {
        setPositionSelectCount(res.data);
      })
      .catch(() => toast({ title: "Something went wrong", variant : "destructive" }));
  };

  const onSubmit = () => {
    if (data.workspaceId === selectedWorkspace && data.order === selectedPosition)
      return;
    const userId = session?.user?.id;
    startTransition(async () => {
      const isAuthorized = await IsUserWorkspaceAuthorized(
        userId!,
        data.workspaceId
      );
      if (isAuthorized) {
        const result = await moveList(
          data.workspaceId,
          data.order,
          selectedWorkspace,
          selectedPosition
        );
        if (result.status === "success") {
          toast({title: "List moved." , variant : "dark"})
          return;
        }
      } else {
        notFound();
      }
    });
  };

  return (
    <div className="px-4">
      <div className="flex flex-col gap-y-2">
        <div>
          <div className="text-xxs font-semibold">Select workspace</div>
          <Select
            value={selectedWorkspace}
            onValueChange={(value) => setSelectWorkspace(value)}
          >
            <SelectTrigger className="bg-black text-xs mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-none">
              {workspaceSelectList.map(
                (option: { name: string; id: string }) => (
                  <SelectItem
                    key={option.id}
                    value={option.id}
                    className="text-xs"
                  >
                    {option.name}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
        <div>
          <div className="text-xxs font-semibold">Position</div>
          <Select
            value={
              positionSelectCount !== 0 ? selectedPosition.toString() : "1"
            }
            onValueChange={(value) => setSelectedPosition(parseInt(value))}
          >
            <SelectTrigger className="bg-black text-xs mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-none">
              {/* select position */}
              {Array.from({ length: positionSelectCount }).map((_, index) => (
                <SelectItem
                  key={index}
                  value={(index + 1).toString()}
                  className="text-xs"
                >
                  {index + 1}
                </SelectItem>
              ))}
              {/* at the end when other list */}
              {data.workspaceId !== selectedWorkspace && (
                <SelectItem
                  value={(positionSelectCount + 1).toString()}
                  className="text-xs"
                >
                  {positionSelectCount + 1}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button
        onClick={onSubmit}
        variant={"blue"}
        size={"sm"}
        className="text-xs mt-4 w-full"
      >
        Move
      </Button>
    </div>
  );
}

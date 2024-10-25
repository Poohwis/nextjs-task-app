import { useSession } from "next-auth/react";
import { useEffect, useState, useTransition } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Card, List, Workspace } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { IsUserWorkspaceAuthorized } from "@/actions/owner-action";
import { moveCard } from "@/actions/card-action";
import { notFound } from "next/navigation";

interface CardOptionProps {
  workspaceId: string;
  data: Card;
  setActiveOption?: (state: number | null) => void;
  setIsDialogOpen?: (state: boolean) => void;
  setIsOpen?: (state: boolean) => void;
}

interface ListWithCards extends List {
  cards: Card[];
}
export default function CardOptionMove({
  workspaceId,
  data,
  setActiveOption,
  setIsDialogOpen,
  setIsOpen,
}: CardOptionProps) {
  const currentPosition = {
    listId: data.listId,
    order: data.order,
  };
  const { data: session } = useSession();
  const [selectedWorkspace, setSelectedWorkspace] = useState(workspaceId);
  const [selectedList, setSelectedList] = useState(data.listId);
  const [selectedPosition, setSelectedPosition] = useState(data.order);
  const [workspaceOptions, setWorkspaceOptions] = useState([]);
  const [listOptions, setListOptions] = useState<ListWithCards[] | []>([]);
  const [positionOptions, setPositionOptions] = useState<Card[] | []>([]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  useEffect(() => {
    fetchLists();
  }, [selectedWorkspace]);

  useEffect(() => {
    fetchCards();
  }, [selectedList]);

  const onSubmit = () => {
    const userId = session?.user?.id;
    startTransition(async () => {
      const isAuthorized = await IsUserWorkspaceAuthorized(
        userId!,
        workspaceId
      );
      if (isAuthorized) {
        const result = await moveCard(
          data.id,
          data.listId,
          selectedList,
          data.order,
          selectedPosition
        );
        if (result.status === "success") {
          if (setActiveOption && setIsDialogOpen) {
            setActiveOption(null);
            setIsDialogOpen(false);
            return;
          }
          if (setIsOpen) {
            setIsOpen(false);
          }
        }
      } else {
        notFound();
      }
    });
  };

  const fetchWorkspaces = () => {
    axios
      .get("/api/workspace")
      .then((res) => {
        const workspaceList = res.data.map((workspace: Workspace) => ({
          name: workspace.name,
          id: workspace.id,
        }));
        setWorkspaceOptions(workspaceList);
      })
      .catch(() =>
        toast({ title: "Something went wrong", variant: "destructive" })
      );
  };

  const fetchLists = () => {
    axios
      .get(`/api/workspace/${selectedWorkspace}`)
      .then((res) => {
        if (res.data.length > 0 && selectedWorkspace !== workspaceId) {
          setSelectedList(res.data[0].id);
        } else {
          setSelectedList(data.listId);
        }
        setListOptions(res.data);
      })
      .catch(() =>
        toast({ title: "Something went wrong", variant: "destructive" })
      );
  };

  const fetchCards = () => {
    axios
      .get(`/api/list/${selectedList}`)
      .then((res) => {
        if (selectedList !== data.listId) {
          setSelectedPosition(1);
        }
        setPositionOptions(res.data);
      })
      .catch(() =>
        toast({ title: "Something went wrong", variant: "destructive" })
      );
  };

  return (
    <div className="flex flex-col text-white/80 py-2 gap-y-2">
      <div className="flex flex-col">
        <h2 className="text-xxs font-semibold">Select workspace</h2>
        <Select
          value={selectedWorkspace}
          onValueChange={(value) => setSelectedWorkspace(value)}
        >
          <SelectTrigger className="bg-black text-xs mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-none">
            {workspaceOptions.map((option: { name: string; id: string }) => (
              <SelectItem key={option.id} value={option.id} className="text-xs">
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-row gap-x-2">
        <div className="flex flex-col flex-1">
          <div className="text-xxs font-semibold">List</div>
          <Select
            disabled={listOptions.length === 0}
            value={selectedList}
            onValueChange={(value) => setSelectedList(value)}
          >
            <SelectTrigger className="bg-black mt-1 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-none">
              {listOptions.map((option: List) => (
                <SelectItem
                  key={option.id}
                  value={option.id}
                  className="text-xs"
                >
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col w-14 ">
          <div className="text-xxs font-semibold">Position</div>
          <Select
            disabled={listOptions.length === 0}
            value={selectedPosition.toString()}
            onValueChange={(value) => setSelectedPosition(parseInt(value))}
          >
            <SelectTrigger className="bg-black mt-1 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-none min-w-12 w-14">
              {positionOptions.map((option) => {
                const isCurrent =
                  currentPosition.listId === selectedList &&
                  currentPosition.order === option.order;
                return (
                  <div key={option.id} className="relative flex justify-center">
                    <SelectItem value={option.order.toString()}>
                      {option.order}
                    </SelectItem>
                    {isCurrent && (
                      <div className="text-xxs absolute bottom-0 pointer-events-none text-white/60">
                        current
                      </div>
                    )}
                  </div>
                );
              })}
              {currentPosition.listId !== selectedList && (
                <SelectItem value={(positionOptions.length + 1).toString()}>
                  {positionOptions.length + 1}
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
        className="text-xs mt-2"
      >
        Move
      </Button>
    </div>
  );
}

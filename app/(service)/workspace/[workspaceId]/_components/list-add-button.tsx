"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

interface ListAddButtonProps {
  isPreviousList: boolean;
  isAdding : boolean
  setIsAdding : (state : boolean) => void
}
export default function ListAddButton({ isPreviousList, isAdding, setIsAdding }: ListAddButtonProps) {
  return (
    <div className={ cn("flex-row gap-x-4 ") }>
        <Button
          className="ml-2 flex justify-start h-8 pl-2 text-xs w-[270px]"
          variant={"addCategory"}
          onClick={() => setIsAdding(true)}
        >
          <Plus size={14} className="mr-2" />
          {isPreviousList ? "Add a list" : "Add another list"}
        </Button>
    </div>
  );
}

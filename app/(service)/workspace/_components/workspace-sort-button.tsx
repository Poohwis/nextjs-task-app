"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWorkspaceSortByStore , SORTOPTION } from "@/store/wsoption-store";
import { ChevronDown } from "lucide-react";

export default function WorkspaceSortButton() {
  const {sortBy, setSortBy} = useWorkspaceSortByStore()
  
  return (
    <div className="flex flex-col items-start my-6 gap-y-1">
      <div className="text-xs text-white font-semibold ml-1">Sort by</div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="relative flex justify-start rounded-sm w-full sm:w-60"
            variant={"confirm"}
            size={"sm"}
          >
            <div className="text-xs text-white/80">{sortBy.title}</div>
            <ChevronDown size={14} color="gray" className="absolute right-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="sm:w-60">
          {SORTOPTION.map((option ,index) => (
            <DropdownMenuItem
            key={index}
              onClick={() => setSortBy(option)}
              className="text-xs"
            >
              {option.title}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

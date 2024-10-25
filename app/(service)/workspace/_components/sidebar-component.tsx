"use client";

import Logo from "@/components/logo";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import PopoverCreateWorkspace from "./popover-create-workspace";
import WorkspaceContainer from "./workspace-container";
import { Workspace } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SidebarComponentProps {
  workspaces: Workspace[];
}
export default function SidebarComponent({
  workspaces,
}: SidebarComponentProps) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <div
        className={cn(
          "z-10 hidden sm:block h-screen bg-darkgray transition-all delay-250 duration-250 hover:brightness-125 hover:cursor-pointer",
          isOpen ? "w-0 -translate-x-4" : "w-4 translate-x-0"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
      <div
        className={cn(
          "transition-all delay-100 duration-300 mt-10  flex items-center justify-center  w-6 h-6 rounded-full bg-darkgray border-white/20 border hover:cursor-pointer",
          isOpen ? "-translate-x-4 " : "translate-x-2"
        )}
      >
            <ChevronRight color="white" size={14} />
      </div>

      </div>
      <div
        className={cn(
          "transition-all duration-250 w-64 bg-black/90 hidden sm:block border-r-[1px] h-screen border-darkgray px-2",
          isOpen ? "shrink-0" : "w-0 -translate-x-64 px-0 border-none "
        )}
      >
        <div
          className={cn("flex flex-row my-4 ml-2 justify-between items-center")}
        >
          <Logo />
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center bg-transparent hover:cursor-pointer hover:brightness-125 hover:bg-darkgray/20"
            onClick={() => setIsOpen(!isOpen)}
          >
            <ChevronLeft color="white" size={14} />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-center px-2">
            <Link href={"/workspace"}>
              <div className="text-sm text-white font-bold">Workspaces</div>
            </Link>
            <PopoverCreateWorkspace>
              <button className="rounded-full hover:cursor-pointer hover:bg-darkgray p-1">
                <Plus size={14} color="white" />
              </button>
            </PopoverCreateWorkspace>
          </div>
          <WorkspaceContainer workspaces={workspaces} />
        </div>
      </div>
    </>
  );
}

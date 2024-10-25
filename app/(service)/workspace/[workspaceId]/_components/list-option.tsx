import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { ChevronLeft, Ellipsis, X } from "lucide-react";
import { useState } from "react";
import ListOptionMove from "./list-option-move";
import ListOptionCopy from "./list-option-copy";
import { List } from "@prisma/client";

interface ListOptionProps {
  data : List
  workspaceId : string
}

export default function ListOption({ data, workspaceId}: ListOptionProps) {
  const [selectedOption, setSelectedOption] = useState<String | null>(null);
  const ListOptions = [
    { title: "Move list",  component: <ListOptionMove data={data} /> },
    { title: "Copy list", component: <ListOptionCopy data={data} /> },
  ];

  const selectedContent = ListOptions.find(
    (option) => option.title === selectedOption
  );

  return (
    <Popover onOpenChange={(open) => (!open ? setSelectedOption(null) : null)}>
      <PopoverTrigger asChild>
        <button className="w-9 h-8 flex items-center justify-center hover:bg-darkgray rounded-full z-10 hover:cursor-pointer">
          <Ellipsis size={14} color="gray" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="bg-darkgray border-white/10 px-0">
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-center px-4">
            <div
              className="hover:cursor-pointer flex-1"
              onClick={() => setSelectedOption(null)}
            >
              {selectedContent && <ChevronLeft size={14} color="gray" />}
            </div>
            <div className="text-xs text-white flex-1 text-center">
              {selectedContent ? selectedContent?.title : "List action"}
            </div>
            <div className="flex-1 flex justify-end">
            <PopoverClose >
              <X size={12} color="white" />
            </PopoverClose>
            </div>
          </div>
          <div className="mt-4">
            {!selectedContent &&
              ListOptions.map((option) => (
                <div
                  key={option.title}
                  onClick={() => setSelectedOption(option.title)}
                  className="text-xs px-4 py-2 hover:cursor-pointer hover:brightness-125 bg-darkgray"
                >
                  {option.title}
                </div>
              ))}
          </div>
        </div>
        {selectedContent?.component}
      </PopoverContent>
    </Popover>
  );
}

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { LucideIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

interface CardOptionPopoverProps {
  header: string;
  content: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onToggle?: () => void;
  children : React.ReactNode
}

export default function CardOptionPopover({
  header,
  content,
  isOpen,
  onOpenChange,
  onToggle,
  children
}: CardOptionPopoverProps) {
  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="bg-darkgray border-white/10 " align="start">
        <div className="flex flex-row justify-between items-center">
          <span />
          <h1 className="flex text-xs text-white">{header}</h1>
          <PopoverClose className="flex items-center" onClick={onToggle}>
            <X size={12} color="white" />
          </PopoverClose>
        </div>
        {content }
      </PopoverContent>
    </Popover>
  );
}

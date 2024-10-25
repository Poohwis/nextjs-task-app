"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CardAddButtonProps {
  handleToggleAddingCard: () => void;
}
export default function CardAddButton({
  handleToggleAddingCard,
}: CardAddButtonProps) {
  return (
    <Button
      className="bg-transparent h-8 text-xs flex justify-start pl-2 w-full border-none"
      onClick={handleToggleAddingCard}
      variant={"confirm"}
    >
      <Plus size={14} className="mr-2" />
      Add a card
    </Button>
  );
}

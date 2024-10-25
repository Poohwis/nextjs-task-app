import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { RefObject } from "react";

interface CreateButtonGroupProps {
  addButtonRef?: RefObject<HTMLButtonElement>;
  cancelButtonRef?: RefObject<HTMLButtonElement>;
  action?: () => void;
  closeAction?: () => void;
  children?: React.ReactNode;
}
export default function CreateButtonGroup({
  addButtonRef,
  cancelButtonRef,
  action,
  closeAction,
  children,
}: CreateButtonGroupProps) {
  return (
    <div className="flex flex-row gap-x-2 justify-start">
      <Button
        ref={addButtonRef}
        className="text-xs border-none font-semibold h-8 rounded-sm  bg-blue-500 hover:bg-blue-600"
        onClick={action}
      >
        {children}
      </Button>
      <Button
        ref={cancelButtonRef}
        className="relative flex items-center justify-center h-8 w-8 bg-transparent rounded-sm hover:bg-darkgray"
        onClick={closeAction}
      >
        <X size={14} className="absolute" color="white" />
      </Button>
    </div>
  );
}

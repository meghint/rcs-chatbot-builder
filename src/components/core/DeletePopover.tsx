import { MoreHorizontal } from "lucide-react";
import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DeletePopoverProps } from "@/types";

export const DeletePopover: FC<DeletePopoverProps> = ({ title, onDelete }) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <MoreHorizontal className="cursor-pointer" />
      </PopoverTrigger>
      <PopoverContent className="w-50">
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => {
            setOpen(false);
            onDelete();
          }}
        >
          {title}
        </Button>
      </PopoverContent>
    </Popover>
  );
};

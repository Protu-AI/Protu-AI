import { Button } from "@/components/ui/button";
import { ChatSession } from "../../types";
import { MoreHorizontal, Trash2, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCallback, useState, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChat } from "@/contexts/ChatContext";
import { useToast } from "@/hooks/use-toast";
import { useClickOutside } from "@/shared/hooks/useClickOutside";

interface ChatListItemProps {
  session: ChatSession;
  isActive: boolean;
  onSelect: (id: string) => void;
}

export function ChatListItem({
  session,
  isActive,
  onSelect,
}: ChatListItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { deleteSession } = useChat();
  const { toast } = useToast();
  const listItemRef = useRef<HTMLButtonElement>(null);

  const handleMoreOptionsClick = useCallback(
    (e: React.MouseEvent<SVGElement>) => {
      e.stopPropagation();
      setIsMenuOpen(!isMenuOpen);
    },
    [isMenuOpen]
  );

  const handleDeleteClick = useCallback(async () => {
    try {
      await deleteSession(session.id);
      toast({
        title: "Success",
        description: "Chat session deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete chat session.",
        variant: "destructive",
      });
    }
  }, [deleteSession, session.id, toast]);

  const handleEditClick = useCallback(() => {
    // Handle edit logic here
    console.log("Edit clicked for session:", session.id);
  }, [session.id]);

  const handleItemClick = useCallback(() => {
    onSelect(session.id);
  }, [onSelect, session.id]);

  useClickOutside(listItemRef, () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  });

  return (
    <div className="relative">
      <DropdownMenu open={isMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              'group relative w-full justify-start rounded-[7px] px-3 py-2.5 font-["Archivo"] text-xl font-normal text-[#808080] dark:text-[#EFE9FC] bg-transparent hover:bg-[#EBEBEB] dark:hover:bg-[#EBEBEB] dark:hover:text-[#808080] transition-all duration-200',
              isActive && "bg-[#EBEBEB] dark:bg-[#EBEBEB] dark:text-[#808080]"
            )}
            onClick={handleItemClick}
            ref={listItemRef}
          >
            <span className="truncate pr-8">{session.title}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="right">
          <DropdownMenuItem
            className="hover:bg-purple-500 hover:text-white cursor-pointer"
            onClick={handleEditClick}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="hover:bg-purple-500 hover:text-white cursor-pointer"
            onClick={handleDeleteClick}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <MoreHorizontal
        className={cn(
          "absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transition-all duration-200 text-[#808080] group-hover:opacity-100 cursor-pointer"
        )}
        onClick={(e) => {
          handleMoreOptionsClick(e);
        }}
      />
    </div>
  );
}

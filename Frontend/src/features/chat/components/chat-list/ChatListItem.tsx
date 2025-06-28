import { Button } from "@/components/ui/button";
import { ChatSession } from "../../types";
import { MoreHorizontal, Trash2, Edit, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCallback, useState, useRef, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChat } from "@/contexts/ChatContext";
import { useToast } from "@/hooks/use-toast";
import { useClickOutside } from "@/shared/hooks/useClickOutside";
import { Input } from "@/components/ui/input";
import { config } from "../../../../../config";

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
  const [isEditing, setIsEditing] = useState(false);
  const [newChatName, setNewChatName] = useState(session.title);
  const { deleteSession } = useChat();
  const { toast } = useToast();
  const itemContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDeleteClick = useCallback(async () => {
    setIsMenuOpen(false);
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
    setIsEditing(true);
    setIsMenuOpen(false);
    setNewChatName(session.title); // Initialize input with current title
  }, [session.title]);

  const handleSaveEdit = useCallback(async () => {
    const trimmedName = newChatName.trim();
    if (trimmedName === "" || trimmedName === session.title) {
      setIsEditing(false);
      setNewChatName(session.title);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication token not found.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(
        `${config.apiUrl}/v1/chats/${session.id}/name`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: trimmedName }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update chat name.");
      }
      setNewChatName(data.data.name);
      session.title = data.data.name;

      toast({
        title: "Success",
        description: "Chat name updated successfully.",
      });
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to update chat session.",
        variant: "destructive",
      });
      setIsEditing(false); // Exit editing mode even on error for now, can be changed
      setNewChatName(session.title);
    }
  }, [newChatName, session, toast]);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setNewChatName(session.title);
  }, [session.title]);

  // This handles clicking the whole list item to select the chat
  const handleSelectChat = useCallback(() => {
    if (!isEditing) {
      // Only select if not in editing mode
      onSelect(session.id);
    }
  }, [onSelect, session.id, isEditing]);

  // Use click outside for the main container to close menu or cancel edit
  useClickOutside(itemContainerRef, (event) => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
    // If editing and click outside the input (and not on save/cancel icons), cancel edit
    if (
      isEditing &&
      inputRef.current &&
      !inputRef.current.contains(event.target as Node)
    ) {
      const targetElement = event.target as HTMLElement;
      const isActionIcon =
        targetElement.closest(".h-5.w-5.text-green-500") ||
        targetElement.closest(".h-5.w-5.text-red-500");
      if (!isActionIcon) {
        handleCancelEdit();
      }
    }
  });

  // Effect to focus input when entering editing mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const truncatedTitle =
    session.title.length > 30
      ? session.title.slice(0, 27) + "..."
      : session.title;

  return (
    <div
      ref={itemContainerRef} // Ref attached to the main div
      className={cn(
        'group relative w-full rounded-[7px] px-3 py-2.5 font-["Archivo"] text-xl font-normal text-[#808080] dark:text-[#EFE9FC] transition-all duration-200 flex items-center justify-between',
        isActive && "bg-[#EBEBEB] dark:bg-[#EBEBEB] dark:text-[#808080]",
        !isEditing &&
          "cursor-pointer hover:bg-[#EBEBEB] dark:hover:bg-[#EBEBEB] dark:hover:text-[#808080]"
      )}
      onClick={handleSelectChat}
    >
      {isEditing ? (
        <Input
          ref={inputRef}
          value={newChatName}
          onChange={(e) => setNewChatName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSaveEdit();
            }
            if (e.key === "Escape") {
              handleCancelEdit();
            }
          }}
          // No need for onClick.stopPropagation here as it's not a child of a clickable Button
          className="w-full bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-xl font-normal text-[#808080] dark:text-[#EFE9FC] dark:placeholder:text-[#EFE9FC]"
        />
      ) : (
        // Display title when not editing, wrapped in a span
        <span className="truncate pr-8">{truncatedTitle}</span>
      )}

      {/* DropdownMenuTrigger and Content */}
      {!isEditing && ( // Only show dropdown trigger if not editing
        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[#808080] dark:text-[#EFE9FC] hover:bg-transparent dark:hover:bg-transparent"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-5 w-5" />
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
      )}

      {/* Save/Cancel Icons when editing */}
      {isEditing && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <Check
            className="h-5 w-5 text-green-500 cursor-pointer hover:scale-110 transition-transform"
            onClick={handleSaveEdit}
          />
          <X
            className="h-5 w-5 text-red-500 cursor-pointer hover:scale-110 transition-transform"
            onClick={handleCancelEdit}
          />
        </div>
      )}
    </div>
  );
}

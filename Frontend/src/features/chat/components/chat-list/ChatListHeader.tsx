import { Button } from '@/components/ui/button';
import { PanelLeftClose, PanelLeftOpen, Plus } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ChatListHeaderProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onNewChat: () => void;
}

export function ChatListHeader({ isCollapsed, onToggle, onNewChat }: ChatListHeaderProps) {
  return (
    <div className={`flex items-center transition-all duration-300 ease-in-out ${isCollapsed ? 'justify-center gap-10' : 'justify-between'}`}>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="group shrink-0 hover:bg-[#EFE9FC] dark:hover:bg-[#EFE9FC] rounded-[7px] w-auto h-auto p-1"
              onClick={onToggle}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="h-8 w-8 text-[#0E1117] dark:text-[#FFBF00]" />
              ) : (
                <PanelLeftClose className="h-8 w-8 text-[#0E1117] dark:text-[#FFBF00]" />
              )}
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent 
            side={isCollapsed ? "bottom" : "right"}
            sideOffset={5}
            className="relative bg-[#EFE9FC] border-none rounded-lg p-2"
          >
            <p className="font-['Archivo'] font-semibold text-sm text-[#0E1117] dark:text-[#1C0B43]">
              {isCollapsed ? 'Open sidebar' : 'Close sidebar'}
            </p>
            <div className={`absolute ${
              isCollapsed 
                ? 'top-[-8px] left-1/2 -translate-x-1/2 border-b-[8px] border-b-[#EFE9FC] border-x-[6px] border-x-transparent' 
                : 'left-[-8px] top-1/2 -translate-y-1/2 border-r-[8px] border-r-[#EFE9FC] border-y-[6px] border-y-transparent'
            } w-0 h-0 border-solid`} />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="transition-transform duration-300 ease-in-out">
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className="group shrink-0 bg-[#5F24E0] dark:bg-[#FFBF00] p-1.5 hover:bg-[#43199D] dark:hover:bg-[#E6AC00] transition-colors duration-300"
                onClick={onNewChat}
              >
                <Plus className="h-6 w-6 text-[#F7F7F7] stroke-[3]" />
                <span className="sr-only">New chat</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent 
              side={isCollapsed ? "bottom" : "left"}
              sideOffset={5}
              className="relative bg-[#EFE9FC] border-none rounded-lg p-2"
            >
              <p className="font-['Archivo'] font-semibold text-sm text-[#0E1117] dark:text-[#1C0B43]">
                New Chat
              </p>
              <div className={`absolute ${
                isCollapsed 
                  ? 'top-[-8px] left-1/2 -translate-x-1/2 border-b-[8px] border-b-[#EFE9FC] border-x-[6px] border-x-transparent' 
                  : 'right-[-8px] top-1/2 -translate-y-1/2 border-l-[8px] border-l-[#EFE9FC] border-y-[6px] border-y-transparent'
              } w-0 h-0 border-solid`} />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

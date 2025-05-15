import { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface ChatInputIconProps {
  icon: LucideIcon;
  position: 'left' | 'right';
  isActive: boolean;
  onClick?: () => void;
}

export function ChatInputIcon({ icon: Icon, position, isActive, onClick }: ChatInputIconProps) {
  const [isHovering, setIsHovering] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div 
      className={cn(
        "absolute top-1/2 -translate-y-1/2 z-10",
        position === 'left' ? "left-[27px]" : "right-[27px]"
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Icon 
        className={cn(
          "h-6 w-6 transition-colors duration-1000",
          isDark
            ? cn(
                "text-[#EFE9FC]",
                (isHovering || isActive) && "text-[#FFBF00]"
              )
            : cn(
                "text-[#A6B5BB]",
                (isHovering || isActive) && "text-[#5F24E0]"
              ),
          isActive && "cursor-pointer"
        )}
        onClick={onClick}
      />
    </div>
  );
}

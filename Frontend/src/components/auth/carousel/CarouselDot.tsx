import { cn } from '@/lib/utils';

interface CarouselDotProps {
  isActive: boolean;
  onClick: () => void;
}

export function CarouselDot({ isActive, onClick }: CarouselDotProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-[71px] h-[9px] rounded-sm transition-colors duration-300",
        isActive ? "bg-[#EFE9FC]" : "bg-[#ABABAB]"
      )}
    />
  );
}

import { cn } from '@/lib/utils';

interface CarouselIndicatorProps {
  isActive: boolean;
  onClick: () => void;
}

export function CarouselIndicator({ isActive, onClick }: CarouselIndicatorProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-[71px] h-[9px] rounded-[4px] transition-all duration-300 cursor-pointer hover:opacity-80",
        "transform hover:scale-105 active:scale-95",
        isActive ? "bg-[#EFE9FC]" : "bg-[#ABABAB] hover:bg-[#CDCDCD]"
      )}
      aria-label={`Carousel indicator ${isActive ? '(current)' : ''}`}
    />
  );
}

import { cn } from '@/lib/utils';

interface CarouselImageProps {
  src: string;
  alt: string;
  isActive: boolean;
  isTransitioning: boolean;
}

export function CarouselImage({ src, alt, isActive, isTransitioning }: CarouselImageProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 transition-opacity duration-1000 ease-in-out",
        isActive ? "opacity-100 z-10" : "opacity-0 z-0"
      )}
      style={{
        transitionDuration: '1000ms',
        pointerEvents: isTransitioning ? 'none' : 'auto'
      }}
    >
      <img
        src={src}
        alt={alt}
        className="w-[903px] h-full object-cover rounded-[32px]"
      />
    </div>
  );
}

import { useAnimation } from '@/contexts/AnimationContext';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function AnimatedButton({ onClick, children, className }: AnimatedButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { buttonRect, setButtonRect } = useAnimation();

  useEffect(() => {
    if (buttonRect && buttonRef.current) {
      const targetRect = buttonRef.current.getBoundingClientRect();
      
      const translateX = buttonRect.left - targetRect.left;
      const translateY = buttonRect.top - targetRect.top;
      const scaleX = buttonRect.width / targetRect.width;
      const scaleY = buttonRect.height / targetRect.height;

      buttonRef.current.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
      
      requestAnimationFrame(() => {
        if (buttonRef.current) {
          buttonRef.current.style.transition = 'transform 0.5s ease-out';
          buttonRef.current.style.transform = 'none';
        }
      });

      setButtonRect(null);
    }
  }, [buttonRect, setButtonRect]);

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className={cn(
        "w-full h-[80px] bg-[#5F24E0] hover:bg-[#9F7CEC] dark:bg-[#9F7CEC] dark:hover:bg-[#BFA7F3] rounded-[16px] transition-colors",
        className
      )}
    >
      {children}
    </button>
  );
}

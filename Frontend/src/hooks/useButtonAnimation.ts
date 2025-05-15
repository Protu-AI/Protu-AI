import { useRef } from "react";
import { useAnimatedButton } from "@/components/animation/AnimatedButtonContext";

export function useButtonAnimation() {
  const buttonRef = useRef<HTMLElement>(null);
  const { startAnimation } = useAnimatedButton();

  const measureAndAnimate = (
    sourceRect: DOMRect,
    targetRect: DOMRect,
    content?: React.ReactNode,
    duration?: number
  ) => {
    startAnimation(sourceRect, targetRect, content, duration);
  };

  return { buttonRef, measureAndAnimate };
}

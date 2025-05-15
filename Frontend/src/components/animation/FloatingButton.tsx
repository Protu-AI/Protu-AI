import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useAnimatedButton } from "./AnimatedButtonContext";

export function FloatingButton() {
  const { state, endAnimation } = useAnimatedButton();
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.isAnimating && buttonRef.current) {
      // First frame - set initial position
      buttonRef.current.style.transition = "none";
      if (state.sourceRect) {
        buttonRef.current.style.left = `${state.sourceRect.left}px`;
        buttonRef.current.style.top = `${state.sourceRect.top}px`;
        buttonRef.current.style.width = `${state.sourceRect.width}px`;
        buttonRef.current.style.height = `${state.sourceRect.height}px`;
      }

      // Force reflow
      buttonRef.current.getBoundingClientRect();

      // Second frame - animate to target
      buttonRef.current.style.transition = `all ${state.duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
      if (state.targetRect) {
        buttonRef.current.style.left = `${state.targetRect.left}px`;
        buttonRef.current.style.top = `${state.targetRect.top}px`;
        buttonRef.current.style.width = `${state.targetRect.width}px`;
        buttonRef.current.style.height = `${state.targetRect.height}px`;
      }

      const timer = setTimeout(endAnimation, state.duration);
      return () => clearTimeout(timer);
    }
  }, [
    state.isAnimating,
    state.sourceRect,
    state.targetRect,
    state.duration,
    endAnimation,
  ]);

  if (!state.isAnimating || !state.sourceRect) return null;

  return createPortal(
    <div
      ref={buttonRef}
      style={{
        position: "fixed",
        backgroundColor: "#5F24E0",
        color: "#FFFFFF",
        borderRadius: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Archivo",
        fontSize: "14px",
        fontWeight: "600",
        pointerEvents: "none",
        zIndex: 9999,
        left: state.sourceRect.left + "px",
        top: state.sourceRect.top + "px",
        width: state.sourceRect.width + "px",
        height: state.sourceRect.height + "px",
      }}
    >
      {state.buttonContent || "Sign In"}
    </div>,
    document.body
  );
}

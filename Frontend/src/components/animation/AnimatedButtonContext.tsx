import { createContext, useContext, useState } from "react";

interface AnimatedButtonState {
  isAnimating: boolean;
  sourceRect: DOMRect | null;
  targetRect: DOMRect | null;
  buttonContent?: React.ReactNode;
  duration?: number;
}

const Context = createContext<{
  state: AnimatedButtonState;
  startAnimation: (
    source: DOMRect,
    target: DOMRect,
    content?: React.ReactNode,
    duration?: number
  ) => void;
  endAnimation: () => void;
} | null>(null);

export function AnimatedButtonProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<AnimatedButtonState>({
    isAnimating: false,
    sourceRect: null,
    targetRect: null,
    buttonContent: null,
    duration: 1000,
  });

  const startAnimation = (
    sourceRect: DOMRect,
    targetRect: DOMRect,
    buttonContent?: React.ReactNode,
    duration: number = 1000
  ) => {
    console.log("Starting animation with:", { sourceRect, targetRect });
    setState({
      isAnimating: true,
      sourceRect,
      targetRect,
      buttonContent,
      duration,
    });
  };

  const endAnimation = () =>
    setState({
      isAnimating: false,
      sourceRect: null,
      targetRect: null,
      buttonContent: null,
      duration: 1000,
    });

  return (
    <Context.Provider value={{ state, startAnimation, endAnimation }}>
      {children}
    </Context.Provider>
  );
}

export const useAnimatedButton = () => {
  const context = useContext(Context);
  if (!context)
    throw new Error(
      "useAnimatedButton must be used within AnimatedButtonProvider"
    );
  return context;
};

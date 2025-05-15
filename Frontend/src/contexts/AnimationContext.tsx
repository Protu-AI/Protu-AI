import { createContext, useContext, useState, ReactNode } from 'react';

interface AnimationContextType {
  buttonRect: DOMRect | null;
  setButtonRect: (rect: DOMRect | null) => void;
}

const AnimationContext = createContext<AnimationContextType | null>(null);

export function AnimationProvider({ children }: { children: ReactNode }) {
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);

  return (
    <AnimationContext.Provider value={{ buttonRect, setButtonRect }}>
      {children}
    </AnimationContext.Provider>
  );
}

export function useAnimation() {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
}

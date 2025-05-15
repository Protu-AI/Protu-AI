import { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";

const AnimationContext = createContext<any>(null);

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const [animating, setAnimating] = useState<{
    from: DOMRect;
    text: string;
  } | null>(null);

  return (
    <AnimationContext.Provider value={{ setAnimating }}>
      {children}
      {animating &&
        createPortal(
          <div
            style={{
              position: "fixed",
              left: animating.from.left + "px",
              top: animating.from.top + "px",
              width: animating.from.width + "px",
              height: animating.from.height + "px",
              backgroundColor: "#5F24E0",
              color: "#FFFFFF",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              fontFamily: "Archivo",
              transition: "all 1000ms cubic-bezier(0.4, 0, 0.2, 1)",
              zIndex: 9999,
            }}
          >
            {animating.text}
          </div>,
          document.body
        )}
    </AnimationContext.Provider>
  );
}

export const useAnimation = () => useContext(AnimationContext);

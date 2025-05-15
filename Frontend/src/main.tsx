import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AnimationProvider } from "./contexts/AnimationContext";
import { AuthProvider } from "./contexts/AuthContext";
// import { ChatProvider } from "./contexts/ChatContext"; // Remove ChatProvider from here
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <Router>
        <AuthProvider>
          <AnimationProvider>
            {/* ChatProvider is now moved to App.tsx */}
            <App />
          </AnimationProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  </StrictMode>
);

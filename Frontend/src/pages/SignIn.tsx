import { SignInForm } from "@/components/auth/signin/SignInForm";
import { ImageCarousel } from "@/components/auth/carousel/ImageCarousel";
import { useTheme } from "next-themes";

export function SignIn() {
  const { theme } = useTheme();

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="flex h-screen overflow-hidden bg-gradient-to-b from-white via-[#F9F6FE] to-[#F5F0FD] dark:from-[#1C0B43] dark:to-[#1C0B43]">
        <div className="flex-1 relative flex justify-center">
          <SignInForm />
        </div>
        <div className="pr-7 py-16 flex items-center">
          <ImageCarousel />
        </div>
      </div>
    </div>
  );
}

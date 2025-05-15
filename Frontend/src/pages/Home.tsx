import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { MainLayout } from "@/layouts/MainLayout";

export function Home() {
  const { theme } = useTheme();

  return (
    <MainLayout>
      <div className="flex-1 flex items-center justify-center">
        <h1
          className={cn(
            "font-['Archivo'] text-[101px] font-semibold",
            theme === "dark" ? "text-[#9F7CEC]" : "text-[#5F24E0]"
          )}
        >
          Home
        </h1>
      </div>
    </MainLayout>
  );
}

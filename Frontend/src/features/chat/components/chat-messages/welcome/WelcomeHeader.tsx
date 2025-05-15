import { cn } from '@/lib/utils';

interface WelcomeHeaderProps {
  userName: string;
  isVisible: boolean;
}

export function WelcomeHeader({ userName, isVisible }: WelcomeHeaderProps) {
  return (
    <div className={cn(
      "w-[772px] mb-7 transition-all duration-500 ease-in-out pl-[27px]",
      !isVisible && "opacity-0 translate-y-[-16px]"
    )}>
      <h1 className="font-['Archivo'] text-base font-normal text-[#ABABAB] dark:text-[#EFE9FC] mb-1 transition-colors duration-1000">
        Welcome, {userName}!
      </h1>
      <p className="font-['Archivo'] text-[30px] font-semibold text-[#5F24E0] dark:text-[#BFA7F3] transition-colors duration-1000">
        What can I help with?
      </p>
    </div>
  );
}

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface InputWithIconProps {
  icon?: ReactNode;
  placeholder: string;
  showDivider?: boolean;
  type?: 'text' | 'password' | 'email' | 'tel';
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function InputWithIcon({
  icon,
  placeholder,
  showDivider,
  type = 'text',
  value,
  onChange,
  error
}: InputWithIconProps) {
  return (
    <div className="relative flex-1">
      {icon && (
        <>
          <div className="absolute left-[27px] top-1/2 -translate-y-1/2 text-[#A6B5BB] dark:text-[#EFE9FC] transition-colors duration-1000">
            {icon}
          </div>
          {showDivider && (
            <div className="absolute left-[68px] top-1/2 -translate-y-1/2 w-[1px] h-[39px] bg-[#A6B5BB] dark:bg-[#EFE9FC] transition-colors duration-1000" />
          )}
        </>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={cn(
          "w-full h-[80px] rounded-[16px] py-5 font-['Archivo'] text-base transition-colors duration-1000 shadow-[0px_3px_6px_rgba(0,0,0,0.1)]",
          "bg-white dark:bg-[#BFA7F3]/80",
          "text-[#808080] dark:text-[#EFE9FC]",
          "placeholder:text-[#A6B5BB] dark:placeholder:text-[#EFE9FC]",
          icon ? "pl-[95px]" : "pl-[27px]",
          "pr-[27px]",
          error 
            ? "border-red-500" 
            : "border-[#A6B5BB] dark:border-[#BFA7F3] focus:border-[#5F24E0] dark:focus:border-[#FFBF00]"
        )}
      />
      {error && (
        <p className="absolute -bottom-6 left-0 text-red-500 dark:text-red-400 text-sm font-['Archivo'] transition-colors duration-1000">
          {error}
        </p>
      )}
    </div>
  );
}

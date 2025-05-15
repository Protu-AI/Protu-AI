import { Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function EmailInput({ value, onChange }: EmailInputProps) {
  return (
    <div className="relative w-full">
      <div className="absolute left-[27px] top-1/2 -translate-y-1/2 flex items-center">
        <Mail className="w-[21px] h-[21px] text-[#A6B5BB]" />
        <div className="ml-[26px] w-[1px] h-[39px] bg-[#A6B5BB]" />
      </div>
      <input
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter Your Email Address"
        className={cn(
          "w-full h-[80px] bg-white rounded-[16px] pl-[95px] pr-[27px] py-5",
          "font-['Archivo'] text-base placeholder:text-[#A6B5BB] text-[#808080]",
          "border border-[#A6B5BB] focus:border-[#5F24E0] outline-none transition-colors"
        )}
      />
    </div>
  );
}

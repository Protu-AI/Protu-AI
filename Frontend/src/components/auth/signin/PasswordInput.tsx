import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function PasswordInput({ value, onChange }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-[27px] top-1/2 -translate-y-1/2 flex items-center"
      >
        {showPassword ? (
          <EyeOff className="w-[21px] h-[21px] text-[#A6B5BB] hover:text-[#5F24E0] transition-colors" />
        ) : (
          <Eye className="w-[21px] h-[21px] text-[#A6B5BB] hover:text-[#5F24E0] transition-colors" />
        )}
      </button>
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your password"
        className={cn(
          "w-full h-[80px] bg-white rounded-[16px] pl-[27px] pr-[64px] py-5",
          "font-['Archivo'] text-base placeholder:text-[#A6B5BB] text-[#808080]",
          "border border-[#A6B5BB] focus:border-[#5F24E0] outline-none transition-colors"
        )}
      />
    </div>
  );
}

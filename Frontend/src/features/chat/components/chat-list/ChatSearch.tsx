import { Search } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ChatSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function ChatSearch({ value, onChange }: ChatSearchProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ABABAB]" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Search chats..."
        className={cn(
          "h-10 w-full rounded-lg pl-10 pr-4 text-sm font-normal text-[#ABABAB] placeholder:text-[#ABABAB] font-['Archivo'] transition-all duration-300 ease-in-out outline-none",
          isFocused ? "bg-[#EAE1FE]" : "bg-[#EFE9FC]"
        )}
      />
    </div>
  );
}

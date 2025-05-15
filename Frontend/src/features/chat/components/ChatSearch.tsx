import { Search } from 'lucide-react';

interface ChatSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function ChatSearch({ value, onChange }: ChatSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ABABAB]" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search chats..."
        className="h-10 w-full rounded-lg bg-[#EFE9FC] pl-10 pr-4 text-sm font-semibold text-[#ABABAB] placeholder:text-[#ABABAB] placeholder:font-semibold focus:outline-none focus:ring-2 focus:ring-[#5F24E0]/20 font-['Archivo']"
      />
    </div>
  );
}

import { cn } from '@/lib/utils';

interface GenderSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function GenderSelect({ value, onChange, error }: GenderSelectProps) {
  return (
    <div className="space-y-2">
      <div className="flex gap-8">
        {['Male', 'Female', 'Other'].map((gender) => (
          <label key={gender} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="gender"
              value={gender}
              checked={value === gender}
              onChange={(e) => onChange(e.target.value)}
              className="w-5 h-5 accent-[#5F24E0] dark:accent-[#FFBF00] transition-colors duration-1000"
            />
            <span className="font-['Archivo'] text-base text-[#A6B5BB] dark:text-[#EFE9FC] transition-colors duration-1000">
              {gender}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p className="text-red-500 dark:text-red-400 text-sm font-['Archivo'] transition-colors duration-1000">
          {error}
        </p>
      )}
    </div>
  );
}

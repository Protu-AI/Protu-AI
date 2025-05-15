import { useRef, useEffect } from 'react';

interface VerificationInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function VerificationInput({ value, onChange }: VerificationInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleInput = (index: number, inputValue: string) => {
    if (!/^\d*$/.test(inputValue)) return;

    const newValue = value.split('');
    newValue[index] = inputValue;
    const finalValue = newValue.join('');
    onChange(finalValue);

    // Move to next input if value was entered
    if (inputValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="relative">
          <input
            ref={el => inputRefs.current[index] = el}
            type="text"
            maxLength={1}
            value={value[index] || ''}
            onChange={e => handleInput(index, e.target.value)}
            onKeyDown={e => handleKeyDown(index, e)}
            className="w-[59px] h-[64px] rounded-[12px] border text-center font-['Archivo'] text-[48px] text-[#5F24E0] focus:outline-none transition-colors"
            style={{
              borderColor: value[index] ? '#5F24E0' : '#A6B5BB',
            }}
          />
          {!value[index] && index === value.length && (
            <div className="absolute left-1/2 top-[12px] w-[1px] h-[40px] bg-[#A6B5BB] animate-pulse" />
          )}
        </div>
      ))}
    </div>
  );
}

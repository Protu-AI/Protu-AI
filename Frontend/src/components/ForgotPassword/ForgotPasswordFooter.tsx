interface ForgotPasswordFooterProps {
  step: number;
}

export function ForgotPasswordFooter({ step }: ForgotPasswordFooterProps) {
  const steps = [1, 2, 3, 4];

  return (
    <div className="pb-[94px] flex justify-center">
      <div className="flex gap-4">
        {steps.map((stepNumber) => (
          <div
            key={stepNumber}
            className={`w-[77px] h-[10px] rounded-[4px] ${
              stepNumber === step
                ? 'bg-[#5F24E0]'
                : 'bg-[#D6D6D6]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

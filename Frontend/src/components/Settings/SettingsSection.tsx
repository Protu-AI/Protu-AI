import React from 'react';
import { cn } from '@/lib/utils';

interface SettingsSectionProps {
  children: React.ReactNode;
  className?: string;
  noMargin?: boolean;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ children, className, noMargin }) => {
  return (
    <div
      className={cn(
        'border border-[#A6B5BB] rounded-[24px] p-[35px]',
        !noMargin && 'mb-8',
        className
      )}
    >
      {children}
    </div>
  );
};

export default SettingsSection;

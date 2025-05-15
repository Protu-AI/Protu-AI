import React from 'react';
import { cn } from '@/lib/utils';

interface SettingsLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({ children, sidebar }) => {
  return (
    <div className="flex h-full">
      <aside className="w-[400px]">
        {sidebar}
      </aside>
      <main className="flex-1 bg-white mb-8 rounded-b-2xl px-8 mr-8 ml-8 overflow-y-auto">{children}</main>
    </div>
  );
};

export default SettingsLayout;

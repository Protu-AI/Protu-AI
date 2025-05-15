import { ReactNode } from 'react';
import { Navbar } from '@/components/common/Navbar';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-gradient-to-b from-white via-[#F9F6FE] to-[#F5F0FD] dark:from-[#1C0B43] dark:to-[#1C0B43]">
      <Navbar />
      {children}
    </div>
  );
}

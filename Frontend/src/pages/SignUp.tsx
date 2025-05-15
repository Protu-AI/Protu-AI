import { Brain } from 'lucide-react';
import { SignUpHeader } from '@/components/auth/signup/SignUpHeader';
import { SignUpForm } from '@/components/auth/signup/SignUpForm';
import { useTheme } from 'next-themes';

export function SignUp() {
  const { theme } = useTheme();
  
  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="flex h-screen">
        {/* Left side - Image */}
        <div className="relative w-[720px]">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=720"
            alt="Team collaboration"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-16 left-16">
            <Brain className="w-14 h-14 text-white" />
          </div>
        </div>
        
        {/* Right side - Form */}
        <div className="flex-1 flex flex-col h-full overflow-y-auto bg-gradient-to-b from-white via-[#F9F6FE] to-[#F5F0FD] dark:from-[#1C0B43] dark:via-[#1C0B43] dark:to-[#1C0B43] transition-colors duration-1000">
          <div className="flex flex-col min-h-full py-16 px-16">
            <SignUpHeader />
            <div className="flex-1 flex items-center justify-center my-auto">
              <SignUpForm />
            </div>
            <p className="font-['Archivo'] text-base font-light text-[#A6B5BB] dark:text-[#EFE9FC] text-center max-w-[720px] mx-auto transition-colors duration-1000">
              Welcome to PROTU! Start your programming journey with expert lessons, hands-on practice, and 24/7 support from our AI chatbot. Let's code your future together!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

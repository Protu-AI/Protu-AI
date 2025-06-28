import { SignUpHeader } from '@/components/auth/signup/SignUpHeader';
import { SignUpForm } from '@/components/auth/signup/SignUpForm';

export function SignUp() {
  return (
    <div className="flex h-screen">
      {/* Left side - Image */}
      <div className="relative w-[720px]">
        <img
          src="/Images/Sign Up Artwork-Light Mode.webp"
          alt="Sign Up Artwork"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-16 left-16">
          <img 
            src="/Brand/Logo - Light Mode.svg" 
            alt="PROTU Logo" 
            className="w-[200px] h-[75px] object-fill"
          />
        </div>
      </div>
      
      {/* Right side - Form */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto bg-gradient-to-b from-white via-[#F9F6FE] to-[#F5F0FD]">
        <div className="flex flex-col min-h-full py-16 px-16">
          <SignUpHeader />
          <div className="flex-1 flex items-center justify-center my-auto">
            <SignUpForm />
          </div>
          <p className="font-['Archivo'] text-base font-light text-[#A6B5BB] text-center max-w-[720px] mx-auto">
            Welcome to PROTU! Start your programming journey with expert lessons, hands-on practice, and 24/7 support from our AI chatbot. Let's code your future together!
          </p>
        </div>
      </div>
    </div>
  );
}

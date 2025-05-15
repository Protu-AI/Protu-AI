import { Link, useNavigate } from 'react-router-dom';
import { useAnimation } from '@/contexts/AnimationContext';

export function AuthButtons() {
  const navigate = useNavigate();
  const { setButtonRect } = useAnimation();

  const handleSignInClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    setButtonRect(rect);
    setTimeout(() => {
      navigate('/signin');
    }, 50); // Small delay to ensure the animation starts
  };

  return (
    <div className="flex items-center space-x-[23px]">
      <Link
        to="/signup"
        className="font-['Archivo'] text-sm font-normal text-[#0E1117] hover:text-[#5F24E0] dark:text-[#EFE9FC] dark:hover:text-[#BFA7F3] transition-colors duration-1000"
      >
        Sign Up
      </Link>
      <Link
        to="/signin"
        onClick={handleSignInClick}
        className="font-['Archivo'] text-sm font-normal text-[#EFE9FC] bg-[#5F24E0] hover:bg-[#9F7CEC] px-3 py-2 rounded-[16px] transition-colors duration-300"
      >
        Sign In
      </Link>
    </div>
  );
}

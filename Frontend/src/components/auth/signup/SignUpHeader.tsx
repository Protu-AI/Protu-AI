import { Link } from 'react-router-dom';

export function SignUpHeader() {
  return (
    <div className="flex items-center justify-end mb-16">
      <span className="font-['Archivo'] text-base text-[#A6B5BB] dark:text-[#EFE9FC] transition-colors duration-1000">
        Already have an account?
      </span>
      <Link
        to="/signin"
        className="ml-[22px] px-6 py-2 border-2 border-[#5F24E0] dark:border-[#FFBF00] rounded-[20px] font-['Archivo'] text-[22px] font-semibold text-[#5F24E0] dark:text-[#FFBF00] hover:bg-[#5F24E0] dark:hover:bg-[#FFBF00] hover:text-white transition-all duration-300"
      >
        Sign In
      </Link>
    </div>
  );
}

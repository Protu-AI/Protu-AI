import { motion } from 'framer-motion';

interface SignUpButtonProps {
  type?: 'button' | 'submit';
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function SignUpButton({ type = 'button', onClick, children, className = '' }: SignUpButtonProps) {
  const buttonVariants = {
    initial: { scale: 0.9, y: 20, opacity: 0 },
    animate: { 
      scale: 1, 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      scale: 0.9, 
      y: 20, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      layout
      variants={buttonVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <button
        type={type}
        onClick={onClick}
        className={`py-[27px] px-[176px] bg-[#5F24E0] hover:bg-[#9F7CEC] dark:bg-[#FFBF00] dark:hover:bg-[#E6AC00] text-white font-['Archivo'] text-[22px] font-semibold rounded-[24px] transition-colors duration-300 ${className}`}
      >
        {children}
      </button>
    </motion.div>
  );
}

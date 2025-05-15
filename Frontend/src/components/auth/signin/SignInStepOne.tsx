import { Logo } from "./Logo";
import { EmailInput } from "./EmailInput";
import { Link } from "react-router-dom";
import { AnimatedButton } from "./AnimatedButton";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useFormValidation } from "../signup/useFormValidation";
import { config } from "../../../../config";

interface SignInStepOneProps {
  email: string;
  onEmailChange: (value: string) => void;
  onContinue: (email: string, imageUrl: string) => void;
}

export function SignInStepOne({
  email,
  onEmailChange,
  onContinue,
}: SignInStepOneProps) {
  const { validateField, errors } = useFormValidation();
  // const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleContinue = async () => {
    if (validateField("email", email)) {
      try {
        const response = await fetch(
          `${config.apiUrl}/v1/auth/validate-identifier?userIdentifier=${email}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          // setImageUrl(data.data.imageUrl || null);
          onContinue(email, data.data.imageUrl || "");
        } else {
          console.error("Validation failed:", data.message);
        }
      } catch (error) {
        console.error("Error during validation:", error);
      }
    }
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.1 } },
    exit: { opacity: 0, x: -20 },
  };

  const animationControls = useAnimation();

  useEffect(() => {
    animationControls.start("animate");
  }, [animationControls]);

  return (
    <motion.div
      className="h-full grid grid-rows-[auto_1fr_auto] w-full"
      initial="initial"
      animate={animationControls}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      variants={containerVariants}
    >
      <motion.div className="pt-8" variants={fadeIn}>
        <Logo />
      </motion.div>

      <div className="flex items-center justify-center">
        <div className="w-full flex flex-col items-center">
          <motion.h1
            className="font-['Archivo'] text-[32px] font-semibold text-[#5F24E0] dark:text-[#9F7CEC] text-center"
            variants={fadeIn}
          >
            Welcome Back!
          </motion.h1>

          <motion.p
            className="font-['Archivo'] text-base font-normal text-[#A6B5BB] dark:text-[#EFE9FC] mt-2 mb-8"
            variants={fadeIn}
          >
            Welcome Back, Please Enter your Details
          </motion.p>

          <motion.div className="w-full" variants={fadeIn}>
            <EmailInput value={email} onChange={onEmailChange} />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </motion.div>

          <motion.div className="w-full mt-6" variants={fadeIn}>
            <AnimatedButton onClick={handleContinue}>
              <span className="font-['Archivo'] text-[22px] font-semibold text-white">
                Continue
              </span>
            </AnimatedButton>
          </motion.div>

          <motion.div
            className="mt-8 w-full flex items-center"
            variants={fadeIn}
          >
            <div className="flex-1 h-[1px] bg-[#A6B5BB] dark:bg-[#EFE9FC]" />
            <span className="mx-[7px] font-['Archivo'] text-base font-normal text-[#A6B5BB] dark:text-[#EFE9FC]">
              OR
            </span>
            <div className="flex-1 h-[1px] bg-[#A6B5BB] dark:bg-[#EFE9FC]" />
          </motion.div>

          <motion.p
            className="mt-6 font-['Archivo'] text-base"
            variants={fadeIn}
          >
            <span className="text-[#A6B5BB] dark:text-[#EFE9FC]">
              Doesn't have an account?{" "}
            </span>
            <Link
              to="/signup"
              className="font-semibold text-[#5F24E0] hover:text-[#9F7CEC] dark:text-[#9F7CEC] dark:hover:text-[#BFA7F3] transition-colors"
            >
              Sign Up
            </Link>
          </motion.p>
        </div>
      </div>

      <motion.div className="pb-8" variants={fadeIn}>
        <p className="max-w-[420px] mx-auto font-['Archivo'] text-base font-light text-[#A6B5BB] dark:text-[#EFE9FC] text-center">
          Welcome back to PROTU! Jump right in to continue learning, solve
          challenges, and get guidance from our AI chatbot. Let's keep building
          your programming skills!
        </p>
      </motion.div>
    </motion.div>
  );
}

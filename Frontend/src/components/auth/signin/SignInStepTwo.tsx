import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Logo } from "./Logo";
import { PasswordInput } from "./PasswordInput";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useFormValidation } from "../signup/useFormValidation";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

interface SignInStepTwoProps {
  email: string;
  onBack: () => void;
  imageUrl: string;
}

export function SignInStepTwo({ email, onBack, imageUrl }: SignInStepTwoProps) {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { validateField, errors } = useFormValidation();
  const { signIn, user } = useAuth();
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  );

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn({ email, password });
      setMessage("Successfully signed in");
      setMessageType("success");
      navigate("/");
    } catch (error) {
      console.error("Error during sign-in:", error);
      setMessage("Sign-in failed");
      setMessageType("error");
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
      <motion.div className="pt-[94px]" variants={fadeIn}>
        <Logo />
      </motion.div>

      <div className="flex items-center justify-center">
        <div className="w-[420px] flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="font-['Archivo'] text-[32px] font-semibold text-[#5F24E0] dark:text-[#9F7CEC] text-center">
              Welcome Back!
            </h1>

            <p className="font-['Archivo'] text-base font-normal text-[#A6B5BB] dark:text-[#EFE9FC] mt-2">
              Welcome Back, Please Enter your Details
            </p>
          </motion.div>

          <motion.div
            className="w-[110px] h-[110px] rounded-full bg-[#F5F5F5] dark:bg-[#BFA7F3]/50 mt-5 mb-8 border border-[#5F24E0] dark:border-[#9F7CEC]"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <img
              src={
                user?.avatar ||
                imageUrl ||
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=250"
              }
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          </motion.div>

          <motion.p
            className="font-['Archivo'] text-base font-semibold text-[#0E1117] dark:text-[#EFE9FC] mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {email}
          </motion.p>

          <div className="w-full">
            <PasswordInput value={password} onChange={setPassword} />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
            {message && (
              <div
                className={`mt-4 p-4 rounded-md ${
                  messageType === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            <button
              onClick={handleSignIn}
              className="w-full h-[80px] mt-6 bg-[#5F24E0] dark:bg-[#9F7CEC] hover:bg-[#9F7CEC] dark:hover:bg-[#BFA7F3] rounded-[16px] transition-colors"
            >
              <span className="font-['Archivo'] text-[22px] font-semibold text-white">
                Sign in
              </span>
            </button>

            <Link
              to="/forgot-password"
              className="block text-center mt-6 font-['Archivo'] text-xl font-semibold text-[#5F24E0] dark:text-[#9F7CEC] hover:text-[#9F7CEC] dark:hover:text-[#BFA7F3] transition-colors"
            >
              I forgot my password
            </Link>

            <Link
              to="/signin"
              className="block text-center mt-6 font-['Archivo'] text-xl font-semibold text-[#5F24E0] dark:text-[#9F7CEC] hover:text-[#9F7CEC] dark:hover:text-[#BFA7F3] transition-colors"
              onClick={onBack}
            >
              <span className="text-[#A6B5BB] dark:text-[#EFE9FC] cursor-default font-normal">
                Not you?{" "}
              </span>
              Use another account
            </Link>
            <div className="mt-8 w-full flex items-center">
              <div className="flex-1 h-[1px] bg-[#A6B5BB] dark:bg-[#EFE9FC]" />
              <span className="mx-[7px] font-['Archivo'] text-base font-normal text-[#A6B5BB] dark:text-[#EFE9FC]">
                OR
              </span>
              <div className="flex-1 h-[1px] bg-[#A6B5BB] dark:bg-[#EFE9FC]" />
            </div>

            <div className="w-full text-center mt-6 font-['Archivo'] text-base">
              <span className="text-[#A6B5BB] dark:text-[#EFE9FC] pointer-events-none">
                Doesn't have an account?{" "}
              </span>
              <Link
                to="/signup"
                className="font-semibold text-[#5F24E0] hover:text-[#9F7CEC] dark:text-[#9F7CEC] dark:hover:text-[#BFA7F3] transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>

      <motion.div className="pb-[52px] px-4" variants={fadeIn}>
        <p className="max-w-[420px] mx-auto font-['Archivo'] text-base font-light text-[#A6B5BB] dark:text-[#EFE9FC] text-center">
          Welcome back to PROTU! Jump right in to continue learning, solve
          challenges, and get guidance from our AI chatbot. Let's keep building
          your programming skills!
        </p>
      </motion.div>
    </motion.div>
  );
}

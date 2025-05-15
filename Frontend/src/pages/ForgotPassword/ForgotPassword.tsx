import React, { useState } from "react";
import { ForgotPasswordStep1 } from "./ForgotPasswordStep1";
import { ForgotPasswordStep2 } from "./ForgotPasswordStep2";
import { ForgotPasswordStep3 } from "./ForgotPasswordStep3";
import { ForgotPasswordStep4 } from "./ForgotPasswordStep4";
import { ForgotPasswordHeader } from "@/components/ForgotPassword/ForgotPasswordHeader";
import { ForgotPasswordFooter } from "@/components/ForgotPassword/ForgotPasswordFooter";
import { motion, AnimatePresence } from "framer-motion";

export function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      className="flex h-screen w-full flex-col bg-gradient-to-b from-white via-[#F9F6FE] to-[#F5F0FD] dark:from-[#1C0B43] dark:to-[#1C0B43]"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <ForgotPasswordHeader />
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" variants={containerVariants}>
              <ForgotPasswordStep1
                setStep={setStep}
                email={email}
                setEmail={setEmail}
              />
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="step2" variants={containerVariants}>
              <ForgotPasswordStep2 setStep={setStep} email={email} />
            </motion.div>
          )}
          {step === 3 && (
            <motion.div key="step3" variants={containerVariants}>
              <ForgotPasswordStep3 setStep={setStep} email={email} />
            </motion.div>
          )}
          {step === 4 && (
            <motion.div key="step4" variants={containerVariants}>
              <ForgotPasswordStep4 />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <ForgotPasswordFooter step={step} />
    </motion.div>
  );
}

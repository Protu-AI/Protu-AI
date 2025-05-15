import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Fingerprint } from "lucide-react";
import { motion } from "framer-motion";
import { useFormValidation } from "@/components/auth/signup/useFormValidation";
import { config } from "../../../config";

interface ForgotPasswordStep2Props {
  setStep: (step: number) => void;
  email: string;
}

export function ForgotPasswordStep2({
  setStep,
  email,
}: ForgotPasswordStep2Props) {
  const [otp, setOtp] = useState(""); // OTP as a single string
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">();
  const [isLoading, setIsLoading] = useState(false);
  const { validateField, errors } = useFormValidation();

  const handleVerifyOtp = async () => {
    // Validate the OTP field
    if (!validateField("otp", otp)) {
      setMessage("Please enter a valid OTP");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    setMessage("");
    setMessageType(undefined);

    try {
      // Make the API call
      const response = await fetch(
        `${config.apiUrl}/v1/auth/verify-password-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            OTP: otp, // Send the OTP string
          }),
        }
      );

      // Handle non-200 responses
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to verify OTP");
      }

      // Parse the response
      const responseData = await response.json();
      console.log("OTP verified successfully:", responseData);

      // Show success message
      setMessage("Password reset OTP is verified successfully");
      setMessageType("success");

      // Move to the next step
      setTimeout(() => setStep(3), 1000); // Delay navigation for better UX
    } catch (error) {
      console.error("Error verifying OTP:", error);

      // Show error message
      setMessage(
        error instanceof Error ? error.message : "Failed to verify OTP"
      );
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInput = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return; // Allow only digits

    // Update the OTP string
    const newOtp = otp.substring(0, index) + value + otp.substring(index + 1);
    setOtp(newOtp);

    // Auto-focus to the next input if a digit is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div className="flex flex-col items-center">
      <motion.div
        className="bg-[#5F24E0] rounded-[24px] p-[15px] mb-[32px]"
        variants={fadeIn}
        initial="initial"
        animate="animate"
      >
        <Fingerprint className="w-[50px] h-[50px] text-white" />
      </motion.div>
      <motion.h1
        className="font-['Archivo'] text-[32px] font-semibold text-center text-[#5F24E0]"
        variants={fadeIn}
        initial="initial"
        animate="animate"
      >
        Verify OTP
      </motion.h1>
      <motion.p
        className="font-['Archivo'] text-base text-[#A6B5BB] text-center mt-[8px]"
        variants={fadeIn}
        initial="initial"
        animate="animate"
      >
        Enter the OTP sent to your email.
      </motion.p>
      <motion.div
        className="mt-[32px]"
        variants={fadeIn}
        initial="initial"
        animate="animate"
      >
        {/* OTP Input Boxes */}
        <div className="flex gap-4">
          {Array(6)
            .fill(null)
            .map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                ref={(el) => (inputRefs.current[index] = el)}
                value={otp[index] || ""}
                onChange={(e) => handleInput(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={cn(
                  'w-[59px] h-[64px] rounded-[12px] border border-[#A6B5BB] bg-white font-["Archivo"] text-[48px] text-center',
                  otp[index]
                    ? "text-[#5F24E0] border-[#5F24E0]"
                    : "text-[#A6B5BB]"
                )}
              />
            ))}
        </div>
        {errors.otp && (
          <p className="text-red-500 text-sm mt-1 text-center">{errors.otp}</p>
        )}
      </motion.div>

      {/* Feedback Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "mt-4 text-center w-[400px]",
            messageType === "success" ? "text-green-600" : "text-red-500"
          )}
        >
          {message}
        </motion.div>
      )}

      <motion.div variants={fadeIn} initial="initial" animate="animate">
        <Button
          className="mt-[32px] w-[400px] h-[80px] bg-[#5F24E0] hover:bg-[#9F7CEC] text-[#EFE9FC] font-['Archivo'] text-[22px] font-semibold rounded-[24px]"
          onClick={handleVerifyOtp}
          disabled={isLoading}
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </Button>
      </motion.div>
      <motion.div
        className="mt-[24px] font-['Archivo'] text-[16px] font-semibold text-center"
        variants={fadeIn}
        initial="initial"
        animate="animate"
      >
        <span className="text-[#A6B5BB]">Didn’t receive the code? </span>
        <Link
          to="#"
          className="text-[#5F24E0] hover:text-[#9F7CEC] transition-colors"
        >
          Resend Code
        </Link>
      </motion.div>
    </motion.div>
  );
}

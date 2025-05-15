import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Fingerprint, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useFormValidation } from "@/components/auth/signup/useFormValidation";
import { config } from "../../../config";

interface ForgotPasswordStep3Props {
  setStep: (step: number) => void;
  email: string;
}

export function ForgotPasswordStep3({
  setStep,
  email,
}: ForgotPasswordStep3Props) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">();
  const [isLoading, setIsLoading] = useState(false);
  const { validateField, errors } = useFormValidation();

  const handleResetPassword = async () => {
    // Validate the password fields
    if (
      !validateField("password", password) ||
      !validateField("confirmPassword", confirmPassword, password)
    ) {
      setMessage("Please enter valid passwords");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    setMessage("");
    setMessageType(undefined);

    try {
      // Make the API call
      const response = await fetch(`${config.apiUrl}/v1/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      // Handle non-200 responses
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to reset password");
      }

      // Parse the response
      const responseData = await response.json();
      console.log("Password reset successfully:", responseData);

      // Show success message
      setMessage("Password is reset successfully.");
      setMessageType("success");

      // Move to the next step
      setTimeout(() => setStep(4), 1000); // Delay navigation for better UX
    } catch (error) {
      console.error("Error resetting password:", error);

      // Show error message
      setMessage("Failed to reset password");
      setMessageType("error");
    } finally {
      setIsLoading(false);
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
        Create a New Password
      </motion.h1>
      <motion.p
        className="font-['Archivo'] text-base text-[#A6B5BB] text-center mt-[8px]"
        variants={fadeIn}
        initial="initial"
        animate="animate"
      >
        Choose a strong password to secure your account
      </motion.p>
      <motion.div
        className="w-[400px]"
        variants={fadeIn}
        initial="initial"
        animate="animate"
      >
        <div className="relative mb-4">
          <div className="absolute top-1/2 left-[27px] -translate-y-1/2 flex items-center">
            <Lock className="text-[#A6B5BB]" />
            <div className="h-[39px] w-[1px] bg-[#A6B5BB] ml-[26px]" />
          </div>
          <Input
            type="password"
            placeholder="Enter your new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={cn(
              "w-full h-[80px] rounded-[24px] border border-[#A6B5BB] bg-white font-['Archivo'] text-[16px] focus:outline-none focus:border-[#5F24E0]",
              password ? "text-[#0E1117]" : "text-[#A6B5BB]",
              "pl-[95px]"
            )}
            style={{ fontFamily: "Archivo", fontWeight: "400" }}
          />
          {errors.password && (
            <p className="text-red-500 text-sm font-['Archivo'] mt-1">
              {errors.password}
            </p>
          )}
        </div>
        <div className="relative mb-8">
          <div className="absolute top-1/2 left-[27px] -translate-y-1/2 flex items-center">
            <Lock className="text-[#A6B5BB]" />
            <div className="h-[39px] w-[1px] bg-[#A6B5BB] ml-[26px]" />
          </div>
          <Input
            type="password"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={cn(
              "w-full h-[80px] rounded-[24px] border border-[#A6B5BB] bg-white font-['Archivo'] text-[16px] focus:outline-none focus:border-[#5F24E0]",
              confirmPassword ? "text-[#0E1117]" : "text-[#A6B5BB]",
              "pl-[95px]"
            )}
            style={{ fontFamily: "Archivo", fontWeight: "400" }}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm font-['Archivo'] mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>
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
          className="mt-[24px] w-[400px] h-[80px] bg-[#5F24E0] hover:bg-[#9F7CEC] text-[#EFE9FC] font-['Archivo'] text-[22px] font-semibold rounded-[24px]"
          onClick={handleResetPassword}
          disabled={isLoading}
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </Button>
      </motion.div>
    </motion.div>
  );
}

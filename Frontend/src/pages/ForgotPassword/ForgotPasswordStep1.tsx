import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Fingerprint } from "lucide-react";
import { motion } from "framer-motion";
import { useFormValidation } from "@/components/auth/signup/useFormValidation";
import { config } from "../../../config";

interface ForgotPasswordStep1Props {
  setStep: (step: number) => void;
  email: string;
  setEmail: (email: string) => void;
}

export function ForgotPasswordStep1({
  setStep,
  email,
  setEmail,
}: ForgotPasswordStep1Props) {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">();
  const [isLoading, setIsLoading] = useState(false);
  const { validateField, errors } = useFormValidation();

  const handleSendResetCode = async () => {
    // Validate the email field
    if (!validateField("email", email)) {
      setMessage("Please enter a valid email address");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    setMessage("");
    setMessageType(undefined);

    try {
      // Make the API call
      const response = await fetch(`${config.apiUrl}/v1/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      // Handle non-200 responses
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send reset code");
      }

      // Parse the response
      const responseData = await response.json();
      console.log("Reset code sent successfully:", responseData);

      // Show success message
      setMessage(
        "If the provided email exists, a new password reset verification code is sent to your inbox. Please check your email to proceed."
      );
      setMessageType("success");

      // Move to the next step
      setStep(2);
    } catch (error) {
      console.error("Error sending reset code:", error);

      // Show error message
      setMessage("Failed to send reset code");
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
    <div className="flex flex-col items-center">
      <div className="bg-[#5F24E0] rounded-[24px] p-[15px] mb-[32px]">
        <Fingerprint className="w-[50px] h-[50px] text-white" />
      </div>
      <h1 className="font-['Archivo'] text-[32px] font-semibold text-center text-[#5F24E0]">
        Forgot Your Password?
      </h1>
      <p className="font-['Archivo'] text-base text-[#A6B5BB] text-center mt-[8px]">
        Don’t worry, we’ll help you reset it.
      </p>
      <div className="mt-[24px] w-[400px]">
        <div className="relative">
          <div className="absolute top-1/2 left-[27px] -translate-y-1/2 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#A6B5BB"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-mail"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <div className="h-[39px] w-[1px] bg-[#A6B5BB] ml-[26px]" />
          </div>
          <Input
            type="email"
            placeholder="Enter Your Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={cn(
              'w-full h-[80px] rounded-[24px] border border-[#A6B5BB] bg-white font-["Archivo"] text-[16px] focus:outline-none focus:border-[#5F24E0]',
              email ? "text-[#0E1117]" : "text-[#A6B5BB]",
              "pl-[95px]"
            )}
            style={{ fontFamily: "Archivo", fontWeight: "400" }}
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

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

      <Button
        className="mt-[24px] w-[400px] h-[80px] bg-[#5F24E0] hover:bg-[#9F7CEC] text-[#EFE9FC] font-['Archivo'] text-[22px] font-semibold rounded-[24px]"
        onClick={handleSendResetCode}
        disabled={isLoading}
      >
        {isLoading ? "Sending..." : "Send Reset Code"}
      </Button>
      <div className="mt-[24px]">
        <Link
          to="/signin"
          className="font-['Archivo'] text-[16px] font-semibold text-[#5F24E0] hover:text-[#9F7CEC] transition-colors"
        >
          Back to Log in
        </Link>
      </div>
    </div>
  );
}

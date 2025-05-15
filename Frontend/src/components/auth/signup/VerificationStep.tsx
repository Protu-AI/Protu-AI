import { useState } from "react";
import { VerificationInput } from "./VerificationInput";
import { SignUpButton } from "./SignUpButton";
import { AnimatePresence, motion } from "framer-motion";
import { useFormValidation } from "./useFormValidation";
import { useNavigate } from "react-router-dom";
import { config } from "../../../../config";

interface VerificationStepProps {
  email: string;
}

export function VerificationStep({ email }: VerificationStepProps) {
  const [code, setCode] = useState("");
  const { errors, validateField } = useFormValidation();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  );

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateField("verificationCode", code)) {
      try {
        const response = await fetch(`${config.apiUrl}/v1/auth/verify-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            OTP: code,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setMessage(
            "Email verified successfully. Your account is now active."
          );
          setMessageType("success");
          navigate("/signin");
        } else if (data.message === "Email already verified") {
          setMessage("Email already verified");
          setMessageType("error");
        } else if (data.message === "Invalid code") {
          setMessage("Invalid code");
          setMessageType("error");
        } else {
          setMessage("Verification failed");
          setMessageType("error");
        }
      } catch (error) {
        console.error("Error during verification:", error);
        setMessage("An error occurred during verification");
        setMessageType("error");
      }
    }
  };

  return (
    <motion.form
      onSubmit={handleVerify}
      className="flex-1 flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="text-center mb-16">
        <h1 className="font-['Archivo'] text-[48px] font-semibold text-[#5F24E0] mb-2">
          Verify Your Email
        </h1>
        <p className="font-['Archivo'] text-base text-[#A6B5BB]">
          A verification code has been sent to{" "}
          <span className="text-[#5F24E0]">{email}</span>
        </p>
      </div>

      <div className="w-[830px] flex flex-col items-center">
        <VerificationInput value={code} onChange={setCode} />

        {errors.verificationCode && (
          <p className="mt-2 text-red-500 text-sm font-['Archivo']">
            {errors.verificationCode}
          </p>
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

        <div className="mt-16">
          <AnimatePresence mode="wait">
            <SignUpButton type="submit" key="verify-button">
              Verify
            </SignUpButton>
          </AnimatePresence>
        </div>

        <div className="mt-6 font-['Archivo'] text-base">
          <span className="text-[#A6B5BB]">Didn't receive the code? </span>
          <button
            type="button"
            className="text-[#5F24E0] hover:text-[#9F7CEC] transition-colors"
            onClick={() => {
              /* Implement resend logic */
            }}
          >
            Resend Code
          </button>
        </div>
      </div>
    </motion.form>
  );
}

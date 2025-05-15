import { User, Lock } from "lucide-react";
import { InputWithIcon } from "./InputWithIcon";
import { useState } from "react";
import { useFormValidation } from "./useFormValidation";
// import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { config } from "../../../../config";

interface SecondStepProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;
    verificationCode: string;
    username: string;
    password: string;
    confirmPassword: string;
  };
  nextStep: () => void;
}

export function SecondStep({ formData, nextStep }: SecondStepProps) {
  // const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  );

  const { errors, validateStep } = useFormValidation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(3, { username, password, confirmPassword })) {
      try {
        const response = await fetch(`${config.apiUrl}/v1/auth/sign-up`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            username: username,
            email: formData.email,
            password: password,
            phoneNumber: formData.phone,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setMessage("Signup successful!");
          setMessageType("success");
          nextStep();
        } else if (data.message === "User already exists") {
          setMessage("User already exists");
          setMessageType("error");
        } else {
          setMessage("Signup failed");
          setMessageType("error");
        }
      } catch (error) {
        console.error("Error during signup:", error);
        setMessage("An error occurred during signup");
        setMessageType("error");
      }
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="flex-1 flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="text-center mb-16">
        <h1 className="font-['Archivo'] text-[48px] font-semibold text-[#5F24E0] mb-2">
          Complete Your Profile
        </h1>
        <p className="font-['Archivo'] text-base text-[#A6B5BB]">
          Create your login credentials to get started
        </p>
      </div>

      <div className="w-[830px] space-y-8">
        <InputWithIcon
          icon={<User className="w-5 h-5" />}
          placeholder="Choose a username"
          showDivider
          value={username}
          onChange={(value) => setUsername(value)}
          error={errors.username}
        />

        <InputWithIcon
          icon={<Lock className="w-5 h-5" />}
          placeholder="Create a password"
          type="password"
          showDivider
          value={password}
          onChange={(value) => setPassword(value)}
          error={errors.password}
        />

        <InputWithIcon
          icon={<Lock className="w-5 h-5" />}
          placeholder="Confirm password"
          type="password"
          showDivider
          value={confirmPassword}
          onChange={(value) => setConfirmPassword(value)}
          error={errors.confirmPassword}
        />

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

        <div className="flex justify-center mt-16">
          <button
            type="submit"
            className="py-[27px] px-[110px] bg-[#5F24E0] hover:bg-[#9F7CEC] text-white font-['Archivo'] text-[22px] font-semibold rounded-[24px] transition-colors duration-300"
          >
            Complete Sign-Up
          </button>
        </div>
      </div>
    </motion.form>
  );
}

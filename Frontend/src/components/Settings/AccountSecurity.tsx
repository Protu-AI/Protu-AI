import React, { useState, useEffect } from "react";
import SettingsSection from "@/components/Settings/SettingsSection";
import SettingsHeading from "./SettingsHeading";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Eye, EyeOff } from "lucide-react"; // Import eye icons
import { useAuth } from "@/contexts/AuthContext";
import { config } from "../../../config";

const AccountSecurity: React.FC = () => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPasswordFocus, setCurrentPasswordFocus] = useState(false);
  const [newPasswordFocus, setNewPasswordFocus] = useState(false);
  const [updatePasswordFocus, setUpdatePasswordFocus] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false); // Toggle for current password
  const [showNewPassword, setShowNewPassword] = useState(false); // Toggle for new password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle for confirm password

  const { user } = useAuth();

  const labelStyle = {
    color: "#A6B5BB",
    fontFamily: "Archivo",
    fontWeight: "400",
    fontSize: "18px",
    textAlign: "left",
    marginBottom: "8px",
  };

  const valueStyle = {
    color: "#0E1117",
    fontFamily: "Archivo",
    fontWeight: 600,
    fontSize: "22px",
    textAlign: "left",
  };

  const toggleChangePassword = () => {
    setIsChangingPassword(!isChangingPassword);
  };

  // Input container styling with dynamic border color
  const inputContainerStyle = (isFocused: boolean) =>
    `flex items-center gap-7 px-7 py-7 rounded-[24px] border border-[#A6B5BB] shadow-[0_3px_6px_rgba(0,0,0,0.16)]`;

  // Input text styling (made !important to override defaults)
  const inputTextStyle =
    "text-[#A6B5BB] font-Archivo font-normal text-[16px] text-left !p-0 !m-0 !border-0 !shadow-none !ring-0 w-full";

  const validateCurrentPassword = () => {
    let isValid = true;
    let errorMessage = "";

    if (!currentPassword) {
      errorMessage = "Current password is required";
      isValid = false;
    } else if (currentPassword.length < 7) {
      errorMessage = "Current password must be at least 7 characters";
      isValid = false;
    } else if (!/[A-Za-z]/.test(currentPassword)) {
      errorMessage = "Current password must contain at least one letter";
      isValid = false;
    } else if (!/[0-9]/.test(currentPassword)) {
      errorMessage = "Current password must contain at least one number";
      isValid = false;
    }

    setCurrentPasswordError(errorMessage);
    return isValid;
  };

  const validateNewPassword = () => {
    let isValid = true;
    let errorMessage = "";

    if (!newPassword) {
      errorMessage = "New password is required";
      isValid = false;
    } else if (newPassword.length < 7) {
      errorMessage = "New password must be at least 7 characters";
      isValid = false;
    } else if (!/[A-Za-z]/.test(newPassword)) {
      errorMessage = "New password must contain at least one letter";
      isValid = false;
    } else if (!/[0-9]/.test(newPassword)) {
      errorMessage = "New password must contain at least one number";
      isValid = false;
    }

    setNewPasswordError(errorMessage);
    return isValid;
  };

  const validateConfirmNewPassword = () => {
    if (!confirmNewPassword.trim()) {
      setConfirmNewPasswordError("Confirm new password is required");
      return false;
    } else if (newPassword !== confirmNewPassword) {
      setConfirmNewPasswordError("Passwords do not match");
      return false;
    } else {
      setConfirmNewPasswordError(""); // Clear the error if passwords match
      return true;
    }
  };

  // Re-run validation when newPassword or confirmNewPassword changes
  useEffect(() => {
    validateConfirmNewPassword();
  }, [newPassword, confirmNewPassword]);

  const handleUpdatePassword = async () => {
    const isCurrentPasswordValid = validateCurrentPassword();
    const isNewPasswordValid = validateNewPassword();
    const isConfirmNewPasswordValid = validateConfirmNewPassword();

    if (
      isCurrentPasswordValid &&
      isNewPasswordValid &&
      isConfirmNewPasswordValid
    ) {
      try {
        // Retrieve userId and token from local storage
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (!userId || !token) {
          alert("User ID or token not found. Please log in again.");
          return;
        }

        // Make the API call using fetch
        const response = await fetch(
          `${config.apiUrl}/v1/users/${userId}/change-password`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              oldPassword: currentPassword,
              newPassword: newPassword,
            }),
          }
        );

        // Handle response
        if (response.ok) {
          const data = await response.json();
          alert("Password updated successfully!");
          // Reset the form
          setCurrentPassword("");
          setNewPassword("");
          setConfirmNewPassword("");
          setIsChangingPassword(false);
        } else {
          const errorData = await response.json();
          const errorMessage =
            errorData.message || "Failed to update password. Please try again.";
          alert(errorMessage);
        }
      } catch (error) {
        alert("An unexpected error occurred. Please try again.");
        console.error("Error updating password:", error);
      }
    }
  };

  const isFormValid =
    !currentPasswordError &&
    !newPasswordError &&
    !confirmNewPasswordError &&
    currentPassword &&
    newPassword &&
    confirmNewPassword;

  return (
    <>
      <SettingsHeading>
        {isChangingPassword ? "Change Password" : "Password and security"}
      </SettingsHeading>

      {isChangingPassword ? (
        <SettingsSection>
          <div className="space-y-[32px]">
            {/* Current Password Input */}
            <div
              className={inputContainerStyle(currentPasswordFocus)}
              style={{
                borderColor: currentPasswordFocus ? "#5F24E0" : undefined,
              }}
            >
              <Lock className="h-[28px] w-[28px] text-[#A6B5BB]" />
              <div className="h-[28px] w-[1px] bg-[#A6B5BB]" />
              <Input
                type={showCurrentPassword ? "text" : "password"} // Toggle between text and password
                placeholder="Current Password"
                className={inputTextStyle}
                onFocus={() => setCurrentPasswordFocus(true)}
                onBlur={() => setCurrentPasswordFocus(false)}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  validateCurrentPassword();
                }}
              />
              {/* Eye icon to toggle password visibility */}
              <div
                className="cursor-pointer"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-[28px] w-[28px] text-[#A6B5BB]" />
                ) : (
                  <Eye className="h-[28px] w-[28px] text-[#A6B5BB]" />
                )}
              </div>
            </div>
            {currentPasswordError && (
              <div className="text-red-500 mt-4" style={{ marginTop: "16px" }}>
                {currentPasswordError}
              </div>
            )}

            {/* New Password Input */}
            <div
              className={inputContainerStyle(newPasswordFocus)}
              style={{ borderColor: newPasswordFocus ? "#5F24E0" : undefined }}
            >
              <Lock className="h-[28px] w-[28px] text-[#A6B5BB]" />
              <div className="h-[28px] w-[1px] bg-[#A6B5BB]" />
              <Input
                type={showNewPassword ? "text" : "password"} // Toggle between text and password
                placeholder="New Password"
                className={inputTextStyle}
                onFocus={() => setNewPasswordFocus(true)}
                onBlur={() => setNewPasswordFocus(false)}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  validateNewPassword();
                }}
              />
              {/* Eye icon to toggle password visibility */}
              <div
                className="cursor-pointer"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-[28px] w-[28px] text-[#A6B5BB]" />
                ) : (
                  <Eye className="h-[28px] w-[28px] text-[#A6B5BB]" />
                )}
              </div>
            </div>
            {newPasswordError && (
              <div className="text-red-500 mt-4" style={{ marginTop: "16px" }}>
                {newPasswordError}
              </div>
            )}

            {/* Confirm New Password Input */}
            <div
              className={inputContainerStyle(updatePasswordFocus)}
              style={{
                borderColor: updatePasswordFocus ? "#5F24E0" : undefined,
              }}
            >
              <Lock className="h-[28px] w-[28px] text-[#A6B5BB]" />
              <div className="h-[28px] w-[1px] bg-[#A6B5BB]" />
              <Input
                type={showConfirmPassword ? "text" : "password"} // Toggle between text and password
                placeholder="Confirm New Password"
                className={inputTextStyle}
                onFocus={() => setUpdatePasswordFocus(true)}
                onBlur={() => setUpdatePasswordFocus(false)}
                value={confirmNewPassword}
                onChange={(e) => {
                  setConfirmNewPassword(e.target.value);
                  validateConfirmNewPassword(); // Call validation here
                }}
              />
              {/* Eye icon to toggle password visibility */}
              <div
                className="cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-[28px] w-[28px] text-[#A6B5BB]" />
                ) : (
                  <Eye className="h-[28px] w-[28px] text-[#A6B5BB]" />
                )}
              </div>
            </div>
            {confirmNewPasswordError && (
              <div className="text-red-500 mt-4" style={{ marginTop: "16px" }}>
                {confirmNewPasswordError}
              </div>
            )}

            <div className="flex items-center gap-[32px]">
              {/* Update Button */}
              <Button
                size="xl"
                className="bg-[#5F24E0] hover:bg-[#9F7CEC] text-[#EFE9FC] font-Archivo font-semibold text-[22px] text-center rounded-[24px] py-[24px] px-[64px]"
                onClick={handleUpdatePassword}
                disabled={!isFormValid} // Disable the button if the form is not valid
              >
                Update
              </Button>
              {/* Cancel Button */}
              <Button
                variant="link"
                className="text-[#5F24E0] hover:text-[#9F7CEC] font-Archivo font-semibold text-[22px] !p-0 no-underline hover:no-underline"
                onClick={toggleChangePassword}
              >
                Cancel
              </Button>
            </div>
          </div>
        </SettingsSection>
      ) : (
        <>
          <SettingsSection>
            <div style={{ marginBottom: "32px" }}>
              <div style={labelStyle}>Email address</div>
              <div style={valueStyle}>{user ? `${user.email}` : ""}</div>
            </div>

            <div>
              <div style={labelStyle}>Protu password</div>
              <div className="flex items-center">
                <div style={valueStyle}>
                  {user
                    ? `You've set an Protu password. `
                    : "You are not signed in"}
                </div>
                {user ? (
                  <span
                    className="font-Archivo font-semibold text-[22px] text-[#5F24E0] hover:text-[#9F7CEC] cursor-pointer text-center"
                    onClick={toggleChangePassword}
                  >
                    &nbsp;Change password
                  </span>
                ) : null}
              </div>
            </div>
          </SettingsSection>

          <SettingsSection>
            <SettingsHeading>Two-step verification</SettingsHeading>
            <div style={{ marginBottom: "32px" }}>
              <div className="flex items-center justify-between">
                <div>
                  <div style={valueStyle}>SMS</div>
                  <div
                    className="text-[#A6B5BB] font-Archivo text-[18px]"
                    style={{ marginTop: "8px" }}
                  >
                    Receive verification codes via SMS
                  </div>
                </div>
                <Switch id="sms-switch" />
              </div>
            </div>
            <div style={{ marginBottom: "32px" }}>
              <div className="flex items-center justify-between">
                <div>
                  <div style={valueStyle}>Authenticator App</div>
                  <div
                    className="text-[#A6B5BB] font-Archivo text-[18px]"
                    style={{ marginTop: "8px" }}
                  >
                    Use an authenticator app for verification
                  </div>
                </div>
                <Switch id="auth-app-switch" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <div style={valueStyle}>Security Key</div>
                  <div
                    className="text-[#A6B5BB] font-Archivo text-[18px]"
                    style={{ marginTop: "8px" }}
                  >
                    Use a security key for verification
                  </div>
                </div>
                <Switch id="security-key-switch" />
              </div>
            </div>
          </SettingsSection>
        </>
      )}
    </>
  );
};

export default AccountSecurity;

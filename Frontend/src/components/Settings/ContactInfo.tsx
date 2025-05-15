import React, { useState, useRef } from "react";
import SettingsSection from "@/components/Settings/SettingsSection";
import SettingsHeading from "./SettingsHeading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { config } from "../../../config";

const headingStyle = {
  color: "#0E1117",
  fontFamily: "Archivo",
  fontWeight: 600,
  fontSize: "26px",
  textAlign: "left",
};

const ContactInfo: React.FC = () => {
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const handleImageError = () => {
    setImageError(true);
  };

  const gridItemStyle = {
    width: "400px",
    textAlign: "left",
  };

  const labelStyle = {
    color: "#A6B5BB",
    fontFamily: "Archivo",
    fontWeight: "400",
    fontSize: "18px",
    textAlign: "left",
  };

  const valueStyle = {
    color: "#0E1117",
    fontFamily: "Archivo",
    fontWeight: 600,
    fontSize: "22px",
    textAlign: "left",
  };

  const bioStyle = {
    color: "#A6B5BB",
    fontFamily: "Archivo",
    fontWeight: "400",
    fontSize: "22px",
    textAlign: "left",
  };

  const handleAttachPhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCancelClick = () => {
    setSelectedFile(null);
    setIsOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
  };

  const handleAttachPhoto = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      alert("User ID or token is missing. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(
        `${config.apiUrl}/v1/users/${userId}/profile-picture`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        alert("Profile picture updated successfully!");
        setIsOpen(false);
        setSelectedFile(null);
        // Optionally, you can refresh the user data here
      } else {
        const errorData = await response.json();
        alert(
          `Failed to update profile picture: ${
            errorData.message || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
      alert("An error occurred while updating the profile picture.");
    }
  };

  const editButtonStyle = {
    color: "#A6B5BB",
    backgroundColor: "white",
    padding: "12px 26px",
    border: "1px solid #A6B5BB",
    borderRadius: "24px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
    transition: "border-color 0.2s, background-color 0.2s, color 0.2s",
    fontFamily: "Archivo",
    fontWeight: "400", // Regular
    fontSize: "22px",
    textAlign: "left",
  };

  const editButtonHoverStyle = {
    borderColor: "#5F24E0",
    backgroundColor: "#5F24E0",
    color: "white",
  };

  return (
    <>
      <div style={{ marginBottom: "32px" }}>
        <SettingsHeading>My Profile</SettingsHeading>
      </div>
      <SettingsSection>
        <div className="flex items-center">
          <div className="relative">
            {imageError ? (
              <span>Image failed to load</span>
            ) : (
              <img
                src={user?.avatar ? user.avatar : "https://i.pravatar.cc/110"}
                alt="Profile"
                onError={handleImageError}
                style={{
                  width: "110px",
                  height: "110px",
                  borderRadius: "50%",
                  border: "3px solid #5F24E0",
                  objectFit: "cover",
                }}
              />
            )}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <button className="absolute bottom-0 right-0 h-9 w-9 rounded-full bg-[#5F24E0] text-white shadow-md hover:bg-[#794ae9] flex items-center justify-center">
                  <Pencil size={11} />
                  <span className="sr-only">Edit profile picture</span>
                </button>
              </DialogTrigger>
              <DialogContent
                className="sm:max-w-[564px] bg-white text-black p-8 rounded-lg shadow-lg backdrop-blur-sm border border-gray-200"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "24px",
                  border: "none",
                  padding: "32px",
                }}
              >
                <DialogHeader>
                  <DialogTitle
                    style={{
                      color: "#0E1117",
                      fontFamily: "Archivo",
                      fontWeight: 600,
                      fontSize: "32px",
                      textAlign: "center",
                    }}
                  >
                    Edit Photo
                  </DialogTitle>
                  <DialogDescription
                    style={{
                      color: "#A6B5BB",
                      fontFamily: "Archivo",
                      fontWeight: 400,
                      fontSize: "26px",
                      textAlign: "center",
                      marginTop: "8px",
                      marginBottom: "64px",
                    }}
                  >
                    Show clients the best version of yourself!
                  </DialogDescription>
                </DialogHeader>
                <div
                  style={{
                    marginBottom: "24px",
                  }}
                >
                  <div
                    style={{
                      width: "272px",
                      height: "272px",
                      border: "2px dashed #5F24E0",
                      borderRadius: "50%",
                      margin: "0 auto",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "#0E1117",
                      fontFamily: "Archivo",
                      fontWeight: 500,
                      fontSize: "26px",
                      textAlign: "center",
                      lineHeight: "30px",
                      cursor: "pointer",
                    }}
                    onClick={handleAttachPhotoClick}
                  >
                    Attach or Drop
                    <br />
                    photo here
                  </div>
                  <input
                    type="file"
                    style={{ display: "none" }}
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                </div>
                <div
                  style={{
                    color: "#A6B5BB",
                    fontFamily: "Archivo",
                    fontWeight: "500",
                    fontSize: "12px",
                    textAlign: "center",
                    marginBottom: "64px",
                  }}
                >
                  250x250 Min size/ 5 MB Max
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <button
                    onClick={handleCancelClick}
                    style={{
                      fontFamily: "Archivo",
                      fontWeight: 600,
                      fontSize: "22px",
                      color: "#5F24E0",
                      padding: "0",
                      transition: "color 0.2s",
                      cursor: "pointer",
                      backgroundColor: "transparent",
                      border: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#9F7CEC";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#5F24E0";
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAttachPhoto}
                    style={{
                      fontFamily: "Archivo",
                      fontWeight: 600,
                      fontSize: "22px",
                      color: "#EFE9FC",
                      backgroundColor: "#5F24E0",
                      borderRadius: "12px",
                      padding: "12px 50px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      transition: "background-color 0.2s",
                      cursor: "pointer",
                      marginLeft: "32px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#9F7CEC";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#5F24E0";
                    }}
                  >
                    Attach photo
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="ml-8">
            <div
              style={{
                color: "#0E1117",
                fontFamily: "Archivo",
                fontWeight: 600,
                fontSize: "32px",
                marginBottom: "8px",
                textAlign: "left",
              }}
            >
              {user ? `${user.firstName} ${user.lastName}` : "Guest"}
            </div>
            <div
              style={{
                color: "#A6B5BB",
                fontFamily: "Archivo",
                fontWeight: 500,
                fontSize: "22px",
                textAlign: "left",
              }}
            >
              {user ? `${user.email}` : ""}
            </div>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <SettingsHeading>Profile Information</SettingsHeading>
          <div
            style={{ ...editButtonStyle }}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, editButtonHoverStyle);
            }}
            onMouseLeave={(e) => {
              Object.assign(e.currentTarget.style, editButtonStyle);
            }}
          >
            Edit
            <Pencil size={14} fill="#A6B5BB" color="#A6B5BB" />
          </div>
        </div>
        <div
          className="grid grid-cols-2 gap-y-8"
          style={{ columnGap: "0px", rowGap: "32px" }}
        >
          <div style={gridItemStyle}>
            <div style={labelStyle}>First name</div>
            <div style={valueStyle}>{user ? `${user.firstName}` : ""} </div>
          </div>
          <div style={gridItemStyle}>
            <div style={labelStyle}>Last name</div>
            <div style={valueStyle}>{user ? `${user.lastName}` : ""}</div>
          </div>
          <div style={gridItemStyle}>
            <div style={labelStyle}>Username</div>
            <div style={valueStyle}>{user ? `${user.userName}` : ""}</div>
          </div>
          <div style={gridItemStyle}>
            <div style={labelStyle}>Phone</div>
            <div style={valueStyle}>{user ? `${user.phoneNumber}` : ""}</div>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <SettingsHeading>Bio</SettingsHeading>
          <div
            style={{ ...editButtonStyle }}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, editButtonHoverStyle);
            }}
            onMouseLeave={(e) => {
              Object.assign(e.currentTarget.style, editButtonStyle);
            }}
          >
            Edit
            <Pencil size={14} fill="#A6B5BB" color="#A6B5BB" />
          </div>
        </div>
        <div style={{ paddingLeft: "32px" }}></div>
        <div style={{ ...bioStyle, marginBottom: "32px" }}>
          Passionate programmer and tech enthusiast | Always learning, always
          coding | Specializing in Python, JavaScript, and AI development. Let’s
          build something amazing together!
        </div>
      </SettingsSection>
    </>
  );
};

export default ContactInfo;

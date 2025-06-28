import React, { createContext, useContext, useState } from "react";
import { config } from "../../config";
import { ChatSession } from "../features/chat/types";

interface ChatContextType {
  sessions: ChatSession[];
  currentSessionId: string | undefined;
  handleSendMessage: (content: string, file?: File) => Promise<any>;
  handleNewChat: () => Promise<void>;
  handleSelectSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => Promise<void>; // Add this
  setSessions: (newSessions: ChatSession[]) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>();
  const [error, setError] = useState<string | null>(null);

  // Function to update sessions
  const handleSetSessions = (newSessions: ChatSession[]) => {
    setSessions(newSessions);
  };

  // Function to set error
  const handleSetError = (error: string | null) => {
    setError(error);
  };

  // Function to create a new chat
  const createChat = async (name: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found in local storage.");
    }

    const response = await fetch(`${config.apiUrl}/v1/chats`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create chat");
    }

    return response.json();
  };

  // Function to handle new chat creation
  const handleNewChat = async () => {
    const name = prompt("Enter the name of the chat:");
    if (!name) return;

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("User ID not found in local storage.");
      return;
    }

    try {
      const responseData = await createChat(name);

      setSessions((prevSessions) => [
        {
          id: responseData.data.id,
          title: responseData.data.name,
          timestamp: new Date(responseData.data.createdAt),
        },
        ...prevSessions,
      ]);

      setCurrentSessionId(responseData.data.id);
      setError(null);
    } catch (error) {
      console.error("Error creating chat:", error);
      setError("An unexpected error occurred");
    }
  };

  // Function to send a message
  const handleSendMessage = async (content: string, file?: File) => {
    if (!content && !file) {
      console.log("No content or file to send.");
      return;
    }

    // Retrieve the authentication token from local storage.
    const token = localStorage.getItem("token");
    if (!token) {
      console.log(
        "No token found in local storage. User might not be authenticated."
      );
      return;
    }

    // Create a FormData object to send both text content and files (if any).
    const formData = new FormData();
    formData.append("content", content); // Append the text content of the message.
    if (file) {
      formData.append("file", file); // If a file is provided, append it to the form data.
    }

    let requestUrl; // Variable to hold the URL for the API request.
    let requestMethod = "POST";

    try {
      // Determine the API endpoint based on whether a current session exists.
      if (currentSessionId) {
        // If a session ID exists, send the message to the specific session endpoint.
        requestUrl = `${config.apiUrl}/v1/messages/${currentSessionId}`;
        console.log(`Sending message to existing session: ${currentSessionId}`);
      } else {
        // If no session ID exists, create a new chat session by sending the message
        // to the base messages endpoint.
        requestUrl = `${config.apiUrl}/v1/messages`;
        console.log("Creating new chat session and sending initial message.");
      }

      // Perform the API fetch request.
      const response = await fetch(requestUrl, {
        method: requestMethod,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      // Check if the response was successful (status code 2xx).
      if (!response.ok) {
        const errorData = await response.json(); // Parse the error response.
        // Throw an error with a more descriptive message if available.
        throw new Error(
          errorData.message || "Failed to send message or create new chat"
        );
      }

      // Parse the successful response data.
      const responseData = await response.json();
      console.log("Message operation successful:", responseData);

      // If a new chat was created (i.e., currentSessionId was null/undefined initially),
      // update the currentSessionId with the new chatId from the response.
      // This assumes `setCurrentSessionId` is available in the component's scope.
      if (!currentSessionId && responseData.data && responseData.data.chatId) {
        // Ensure `setCurrentSessionId` is defined before calling it.
        if (typeof setCurrentSessionId === "function") {
          setCurrentSessionId(responseData.data.chatId);
          console.log(
            `New session created with ID: ${responseData.data.chatId}`
          );
        } else {
          console.warn(
            "setCurrentSessionId is not defined. Cannot update chat ID after new chat creation."
          );
        }
      }

      // Return the full response data for further handling by the caller.
      return responseData;
    } catch (error) {
      console.error("Error sending message or creating chat:", error);
    }
  };

  // Function to select a session
  const handleSelectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
  };

  // Function to delete a session
  const deleteSession = async (sessionId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found in local storage.");
      return;
    }

    try {
      const response = await fetch(`${config.apiUrl}/v1/chats/${sessionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete chat session");
      }

      // Remove the deleted session from the sessions list
      setSessions((prevSessions) =>
        prevSessions.filter((session) => session.id !== sessionId)
      );

      // If the deleted session was the current session, clear the current session
      if (sessionId === currentSessionId) {
        setCurrentSessionId(undefined);
      }

      setError(null);
    } catch (error) {
      console.error("Error deleting chat session:", error);
      setError("An unexpected error occurred");
    }
  };

  return (
    <ChatContext.Provider
      value={{
        sessions,
        currentSessionId,
        handleSendMessage,
        handleNewChat,
        handleSelectSession,
        deleteSession,
        setSessions: handleSetSessions,
        error,
        setError: handleSetError,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

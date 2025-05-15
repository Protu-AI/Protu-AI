import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import { config } from "../../config";

interface User {
  email: string;
  userName: string;
  avatar: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (credentials: { email: string; password: string }) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Fetch user data on initial load (if token exists)
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (userId && token) {
        try {
          const response = await fetch(`${config.apiUrl}/v1/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            if (response.status === 401) {
              signOut(); // Clear invalid token
            }
            throw new Error("Failed to fetch user data");
          }

          const userData = await response.json();
          setUser({
            email: userData.data.email,
            userName: userData.data.username,
            avatar:
              userData.data.imageUrl ||
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=250",
            firstName: userData.data.firstName,
            lastName: userData.data.lastName,
            phoneNumber: userData.data.phoneNumber,
          });
        } catch (error) {
          console.error(error);
          signOut();
        }
      }
    };

    fetchUserData();
  }, []);

  const navigate = useNavigate();

  const signIn = async (credentials: { email: string; password: string }) => {
    try {
      // 1. Authenticate user
      const loginResponse = await fetch(`${config.apiUrl}/v1/auth/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userIdentifier: credentials.email,
          password: credentials.password,
        }),
      });

      if (!loginResponse.ok) throw new Error("Login failed");
      // 2. Extract token and user ID from login response
      const loginData = await loginResponse.json();
      const token = loginData.data.accessToken;
      const userId = loginData.data.publicId;
      const refreshToken = loginData.data.refreshToken;

      // 3. Store token and user ID in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("refreshToken", refreshToken);

      // 4. Fetch user details using the stored token and ID
      const userResponse = await fetch(`${config.apiUrl}/v1/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!userResponse.ok) throw new Error("Failed to fetch user data");

      const userData = await userResponse.json();
      setUser({
        email: userData.data.email,
        userName: userData.data.username,
        avatar:
          userData.data.imageUrl ||
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=250",
        firstName: userData.data.firstName,
        lastName: userData.data.lastName,
        phoneNumber: userData.data.phoneNumber,
      });
    } catch (error) {
      console.error(error);
      signOut();
      throw error; // Propagate error to UI
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

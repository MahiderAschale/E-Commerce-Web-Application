import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
  } from "react";
  
  import * as authService from "../services/auth.service";
  
 
    interface User {
      id: string;
      fullName: string;
      email: string;
      phone?: string;
      avatar?: string;
      role: "BUYER" | "ADMIN";
      isVerified?: boolean;
      createdAt?: string;
    }
  
  
  interface RegisterData {
    fullName: string;
    email: string;
    password: string;
  }
  
  interface LoginData {
    email: string;
    password: string;
  }
  
  interface AuthContextType {
    user: User | null;
    loading: boolean;
  
    login: (data: LoginData) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
  
    isAuthenticated: boolean;
    isAdmin: boolean;
  }
  
  const AuthContext = createContext<AuthContextType | undefined>(undefined);
  
  export const AuthProvider = ({
    children,
  }: {
    children: ReactNode;
  }) => {
    const [user, setUser] = useState<User | null>(null);
  
    const [loading, setLoading] = useState(true);
  
    const refreshUser = async () => {
      try {
        const response = await authService.getProfile();
  
        setUser(response.data);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      const token = localStorage.getItem("token");
  
      if (token) {
        refreshUser();
      } else {
        setLoading(false);
      }
    }, []);
  
    const register = async (data: RegisterData) => {
      const response = await authService.register(data);
  
      localStorage.setItem("token", response.data.token);
  
      setUser(response.data.user);
    };
  
    const login = async (data: LoginData) => {
      const response = await authService.login(data);
  
      localStorage.setItem("token", response.data.token);
  
      setUser(response.data.user);
    };
  
    const logout = async () => {
      try {
        await authService.logout();
      } catch {}
  
      localStorage.removeItem("token");
  
      setUser(null);
    };
  
    return (
      <AuthContext.Provider
        value={{
          user,
          loading,
  
          login,
          register,
          logout,
          refreshUser,
  
          isAuthenticated: !!user,
          isAdmin: user?.role === "ADMIN",
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  };
  
  export const useAuth = () => {
    const context = useContext(AuthContext);
  
    if (!context) {
      throw new Error("useAuth must be used inside AuthProvider");
    }
  
    return context;
  };
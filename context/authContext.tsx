import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  token: string;
  role: string;
  avatar?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  [key: string]: any; 
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (newData: Partial<User>) => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>; 
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) setUser(JSON.parse(userData));
    };
    loadUser();
  }, []);

  const login = async (userData: User) => {
    setUser(userData);
    await AsyncStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("user");
  };

  const updateUser = async (newData: Partial<User>) => {
    const updated = { ...user, ...newData };
    setUser(updated);
    await AsyncStorage.setItem("user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

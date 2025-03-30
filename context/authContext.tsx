import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const LoadUser = async () => {
            const userData = await AsyncStorage.getItem('user')
            if (userData) setUser(JSON.parse(userData))
        };
        LoadUser();
    },[])

    const login = async (userData: any) => {
        setUser(userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData))
    }
    
    const logout = async () => {
        setUser(null);
        await AsyncStorage.removeItem('user');
      };
    
      return (
        <AuthContext.Provider value={{ user, login, logout }}>
          {children}
        </AuthContext.Provider>
      );
}
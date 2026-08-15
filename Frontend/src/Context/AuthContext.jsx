import { createContext, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth";
import { setAccessToken } from "../api/client";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: authApi.me,
    retry: false,
    staleTime: Infinity,
  });

  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    setAccessToken(data.accessToken);
    queryClient.setQueryData(["me"], data.user);
  };

  const logout = async () => {
    await authApi.logout();
    setAccessToken(null);
    queryClient.setQueryData(["me"], null);
  };

  return (
    <AuthContext.Provider
      value={{ user: user ?? null, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

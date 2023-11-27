import { createContext } from "react";
import { User } from "./App";

interface UserContextProps {
  user: User;
  setUser: (user: User) => void;
  userId: number;
  setUserId: (userId: number) => void;
  error: string;
  setError: (error: string) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

export const UserContext = createContext<UserContextProps | undefined>(
  undefined
);

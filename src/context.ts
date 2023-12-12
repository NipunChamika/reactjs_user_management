import { createContext } from "react";
import { User } from "./App";
import { z } from "zod";
import { emailSchema } from "./components/validation/validation";

type EmailEntryFormData = z.infer<typeof emailSchema>;

interface UserContextProps {
  user: User;
  setUser: (user: User) => void;
  userId: number;
  setUserId: (userId: number) => void;
  error: string;
  setError: (error: string) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  refreshExpiredError: string;
  setRefreshExpiredError: (refreshExpiredError: string) => void;
  email: EmailEntryFormData;
  setEmail: (email: EmailEntryFormData) => void;
  sendOtp: boolean;
  setSendOtp: (sendOtp: boolean) => void;
  passwordResetSuccess: boolean;
  setPasswordResetSuccess: (passwordResetSuccess: boolean) => void;
  isSignupSuccess: boolean;
  setIsSignupSuccess: (isSignupSuccess: boolean) => void;
}

export const UserContext = createContext<UserContextProps | undefined>(
  undefined
);

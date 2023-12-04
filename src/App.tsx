import { useState } from "react";
import LoginUser from "./components/LoginUser";
import Profile from "./components/Profile";
import { UserContext } from "./context";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import SignUpUser from "./components/SignUpUser";
import EmailEntryPage from "./components/EmailEntryPage";
import PasswordResetPage from "./components/PasswordResetPage";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

function App() {
  const [userId, setUserId] = useState<number>(0);
  const [user, setUser] = useState<User>({
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [refreshExpiredError, setRefreshExpiredError] = useState("");
  const [email, setEmail] = useState("");

  const router = createBrowserRouter([
    { path: "/", element: <LoginUser /> },
    { path: "/signup", element: <SignUpUser /> },
    { path: "/profile", element: <Profile /> },
    { path: "/email", element: <EmailEntryPage /> },
    { path: "/password-reset", element: <PasswordResetPage /> },
  ]);

  return (
    <>
      <UserContext.Provider
        value={{
          user,
          setUser,
          userId,
          setUserId,
          error,
          setError,
          isLoggedIn,
          setIsLoggedIn,
          refreshExpiredError,
          setRefreshExpiredError,
          email,
          setEmail,
        }}
      >
        <RouterProvider router={router} />
        {/* {!isLoggedIn ? <LoginUser /> : <Profile />} */}
      </UserContext.Provider>
    </>
  );
}

export default App;

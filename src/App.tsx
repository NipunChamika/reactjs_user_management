import { useState } from "react";
import LoginUser from "./components/LoginUser";
import Profile from "./components/Profile";
import { UserContext } from "./context";

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
        }}
      >
        {!isLoggedIn ? <LoginUser /> : <Profile />}
      </UserContext.Provider>
    </>
  );
}

export default App;

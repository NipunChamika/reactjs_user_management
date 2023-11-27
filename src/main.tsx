import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
// import './index.css'
import "bootstrap/dist/css/bootstrap.css";
import Profile from "./components/Profile.tsx";
import LoginUser from "./components/LoginUser.tsx";
import SignUpUser from "./components/SignUpUser.tsx";
// import Update from "./components/Update.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <LoginUser />,
  },
  {
    path: "/signup",
    element: <SignUpUser />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { loginSchema } from "./validation/validation";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../context";
import ForgotPasswordLink from "./ForgotPasswordLink";

type LoginFormData = z.infer<typeof loginSchema>;

interface Props {}

const LoginUser = ({}: Props) => {
  // console.log(typeof onSubmit);
  // console.log(typeof setUser); // should log 'function'

  const userContext = useContext(UserContext);
  // console.log(userContext);

  if (userContext === undefined) {
    console.log("UserContext not available.");
    return null;
  }

  const {
    setUserId,
    setIsLoggedIn,
    setError,
    error,
    refreshExpiredError,
    setRefreshExpiredError,
  } = userContext;

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = (data: LoginFormData) => {
    axios
      .post("http://localhost:3000/user/login", data)
      .then((res) => {
        console.log(res.data);
        // Store the access token
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        setUserId(res.data.user.id);
        setRefreshExpiredError("");
        setError("");
        setIsLoggedIn(true);
        navigate("/profile");
      })
      .catch((err) => {
        console.log(err);

        if (err.message === "Network Error") {
          setError("Cannot connect to the server. Please try again later.");
        } else if (err.response) {
          setError(err.response.data.message);
        } else {
          setError("Login Failed");
        }
      });
  };

  return (
    <>
      <div className="bg-dark vh-100 d-flex justify-content-center align-items-center">
        <div className="shadow-sm bg-light bg-gradient p-3 w-25 rounded">
          {refreshExpiredError && (
            <p className="text-danger">{refreshExpiredError}</p>
          )}
          {error && <p className="text-danger">{error}</p>}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                <strong>Email</strong>
              </label>
              <input
                {...register("email")}
                id="email"
                type="text"
                className="form-control"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-danger">{errors.email.message}</p>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                <strong>Password</strong>
              </label>
              <input
                {...register("password")}
                id="password"
                type="password"
                className="form-control"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-danger">{errors.password.message}</p>
              )}
            </div>
            <button className="btn btn-success w-100 mb-1">Login</button>
          </form>
          <button
            className="btn btn-outline-primary w-100"
            onClick={() => navigate("/signup")}
          >
            Register
          </button>
          <ForgotPasswordLink />
        </div>
      </div>
    </>
  );
};

export default LoginUser;

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { loginSchema } from "./validation/validation";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../context";
import ForgotPasswordLink from "./ForgotPasswordLink";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

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

  const cardTitle = (
    <div
      style={{
        fontSize: "32px",
        fontWeight: "500",
        textAlign: "center",
      }}
    >
      Log in
    </div>
  );

  return (
    <>
      <div
        className="h-screen flex justify-content-center align-items-center"
        style={{ backgroundColor: "#f4f7fe" }}
      >
        <Card
          title={cardTitle}
          className="shadow-3 bg-white p-3"
          style={{ minWidth: "440px", border: "none", borderRadius: "20px" }}
        >
          {refreshExpiredError && (
            <p className="text-danger">{refreshExpiredError}</p>
          )}
          {error && <p className="text-danger">{error}</p>}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-column mb-2">
              <label
                htmlFor="email"
                className="mb-1"
                style={{
                  fontSize: "20px",
                  fontWeight: "400",
                  color: "#6B6D7C",
                }}
              >
                Email
              </label>
              <InputText
                {...register("email")}
                id="email"
                placeholder="Enter your email"
                className={errors.email && "p-invalid"}
                style={{
                  borderRadius: "10px",
                  padding: "16px 24px",
                  fontSize: "16px",
                }}
              />
              {/* <p
                className={`styles.error-message ${
                  errors.email ? "visible" : ""
                }`}
              >
                {errors.email?.message}
              </p> */}
              {errors.email && (
                <p
                  className="mt-1 mb-0 ml-2"
                  style={{ color: "#F06565", fontSize: "14px" }}
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="flex flex-column mb-2">
              <label
                htmlFor="password"
                className="mb-1 mt-1"
                style={{
                  fontSize: "20px",
                  fontWeight: "400",
                  color: "#6B6D7C",
                }}
              >
                Password
              </label>
              <InputText
                {...register("password")}
                id="password"
                type="password"
                placeholder="Enter your password"
                className={errors.email && "p-invalid"}
                style={{
                  borderRadius: "10px",
                  padding: "16px 24px",
                  fontSize: "16px",
                }}
              />
              {/* <p
                className={`styles.error-message ${
                  errors.password ? "visible" : ""
                }`}
              >
                {errors.password?.message}
              </p> */}
              {errors.password && (
                <p
                  className="mt-1 mb-0 ml-2"
                  style={{ color: "#F06565", fontSize: "14px" }}
                >
                  {errors.password.message}
                </p>
              )}
            </div>
            <ForgotPasswordLink />
            <Button
              label="Log in"
              className="bg-bluegray-800 hover:bg-bluegray-900 mt-3 mb-1 w-full"
              style={{
                border: "none",
                borderRadius: "10px",
                padding: "18px 40px",
                fontSize: "16px",
                fontWeight: "500",
              }}
            />
          </form>
          <div className="mt-2" style={{ fontSize: "14px", fontWeight: "300" }}>
            Don't have an account?&nbsp;
            <Button
              // label="Register"
              link
              onClick={() => navigate("/signup")}
              className="p-0 text-blue-500 hover:text-blue-700"
              style={{ fontSize: "14px" }}
            >
              Register
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
};

export default LoginUser;

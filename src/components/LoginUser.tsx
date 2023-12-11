import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { loginSchema } from "./validation/validation";
import axios from "axios";
import { useContext, useEffect, useRef } from "react";
import { UserContext } from "../context";
import ForgotPasswordLink from "./ForgotPasswordLink";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import sharedStyles from "./SharedStyles.module.css";

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
    refreshExpiredError,
    setRefreshExpiredError,
  } = userContext;

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const toast = useRef<Toast>(null);

  useEffect(() => {
    if (refreshExpiredError && toast.current) {
      toast.current.clear();

      toast.current.show({
        severity: "error",
        summary: "Session Expired",
        detail: refreshExpiredError,
        life: 3000,
      });
    }
  }, [refreshExpiredError]);

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
          // setError("Cannot connect to the server. Please try again later.");
          if (toast.current) {
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: "Cannot connect to the server. Please try again later.",
              life: 3000,
            });
          }
        } else if (err.response) {
          // setError(err.response.data.message);
          if (toast.current) {
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: err.response.data.message,
              life: 3000,
            });
          }
        } else {
          // setError("Login Failed");
          if (toast.current) {
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: "Login Failed",
              life: 3000,
            });
          }
        }
      });
  };

  const cardTitle = <div className={sharedStyles.cardTitle}>Log in</div>;

  return (
    <>
      <Toast ref={toast} />
      <div
        className={`h-screen flex justify-content-center align-items-center ${sharedStyles.container}`}
      >
        <Card
          title={cardTitle}
          className={`shadow-3 bg-white p-3 ${sharedStyles.cardContainer}`}
        >
          {/* {refreshExpiredError && (
            <p className="text-danger">{refreshExpiredError}</p>
          )}
          {error && <p className="text-danger">{error}</p>} */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-column mb-2">
              <label
                htmlFor="email"
                className={`mb-1 ${sharedStyles.formLabel}`}
              >
                Email
              </label>
              <InputText
                {...register("email")}
                id="email"
                placeholder="Enter your email"
                className={`${errors.email && "p-invalid"} ${
                  sharedStyles.formInput
                }`}
              />
              {/* <p
                className={`styles.error-message ${
                  errors.email ? "visible" : ""
                }`}
              >
                {errors.email?.message}
              </p> */}
              {errors.email && (
                <p className={`mt-1 mb-0 ml-2 ${sharedStyles.errorMessage}`}>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="flex flex-column mb-2">
              <label
                htmlFor="password"
                className={`mb-1 mt-1 ${sharedStyles.formLabel}`}
              >
                Password
              </label>
              <InputText
                {...register("password")}
                id="password"
                type="password"
                placeholder="Enter your password"
                className={`${errors.email && "p-invalid"} ${
                  sharedStyles.formInput
                }`}
              />
              {/* <p
                className={`styles.error-message ${
                  errors.password ? "visible" : ""
                }`}
              >
                {errors.password?.message}
              </p> */}
              {errors.password && (
                <p className={`mt-1 mb-0 ml-2 ${sharedStyles.errorMessage}`}>
                  {errors.password.message}
                </p>
              )}
            </div>
            <ForgotPasswordLink />
            <Button
              label="Log in"
              className={`bg-bluegray-800 hover:bg-bluegray-900 mt-3 mb-1 w-full ${sharedStyles.button}`}
            />
          </form>
          <div className={`mt-2 ${sharedStyles.Link}`}>
            Don't have an account?&nbsp;
            <Button
              link
              onClick={() => navigate("/signup")}
              className={`p-0 text-blue-500 hover:text-blue-700 ${sharedStyles.Link}`}
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

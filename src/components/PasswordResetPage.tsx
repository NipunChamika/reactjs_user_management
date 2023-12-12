import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../context";
import { passwordResetSchema } from "./validation/validation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import sharedStyles from "./SharedStyles.module.css";

type PasswordResetFormData = z.infer<typeof passwordResetSchema>;

const PasswordResetPage = () => {
  const userContext = useContext(UserContext);
  // console.log(userContext);

  if (userContext === undefined) {
    console.log("UserContext not available.");
    return null;
  }

  const {
    email,
    setEmail,
    setError,
    setRefreshExpiredError,
    sendOtp,
    setSendOtp,
    setPasswordResetSuccess,
  } = userContext;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordResetFormData>({
    resolver: zodResolver(passwordResetSchema),
  });

  const navigate = useNavigate();

  const [timer, setTimer] = useState(60);

  const [showResend, setShowResend] = useState(false);

  const toast = useRef<Toast>(null);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setShowResend(true);
    }
  }, [timer]);

  useEffect(() => {
    if (sendOtp && toast.current) {
      toast.current.clear();

      toast.current.show({
        severity: "info",
        summary: "Info",
        detail: `We have sent a code to ${email.email}`,
        life: 3000,
      });
    }

    setSendOtp(false);
  }, [sendOtp]);

  const onSubmit = (data: PasswordResetFormData) => {
    const payload = {
      ...data,
      email: email.email,
    };

    axios
      .post("http://localhost:3000/user/reset-password", payload)
      .then((res) => {
        console.log(res.data);
        setEmail({ email: "" });
        setError("");
        setRefreshExpiredError("");
        setPasswordResetSuccess(true);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);

        if (err.message === "Network Error") {
          setError("Cannot connect to the server. Please try again later.");
        } else if (err.response.data.message === "Invalid OTP or Email") {
          setError("Invalid OTP");
        } else if (err.response) {
          setError(err.response.data.message);
        } else {
          setError("Login Failed");
        }
      });
  };

  const handleResend = () => {
    axios
      .post("http://localhost:3000/user/forgot-password", email)
      .then((res) => {
        setEmail(email);
        setShowResend(false);
        setTimer(60);
        setError("");
        // setResendSuccess("A new OTP has been sent to your email");
        if (toast.current) {
          toast.current.show({
            severity: "info",
            summary: "Info",
            detail: "A new OTP has been sent to your email",
            life: 3000,
          });
        }

        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
        // setError("User with the email not found");
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
        } else if (err.response.status === 404) {
          // setError("Cannot connect to the server. Please try again later.");
          if (toast.current) {
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: "User with the email not found",
              life: 3000,
            });
          }
        } else {
          // setError("Login Failed");
          if (toast.current) {
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: "Email Verification Failed",
              life: 3000,
            });
          }
        }
      });
  };

  const cardTitle = (
    <div className={sharedStyles.cardTitle}>Reset Password</div>
  );

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
          {/* {error && <p className="text-danger">{error}</p>} */}
          {/* {resendSuccess && <p className="text-success">{resendSuccess}</p>} */}
          {/* <p className="-mt-3 mb-5">
            We have sent a code to <strong>{email.email}</strong>
          </p> */}
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-column mb-2">
                <label
                  htmlFor="otp"
                  className={`mb-1 ${sharedStyles.formLabel}`}
                >
                  OTP
                </label>
                <InputText
                  {...register("otp")}
                  id="otp"
                  placeholder="Enter OTP code"
                  className={`${errors.otp && "p-invalid"} ${
                    sharedStyles.formInput
                  }`}
                  maxLength={4}
                />
                {errors.otp && (
                  <p className={`mt-1 mb-0 ml-2 ${sharedStyles.errorMessage}`}>
                    {errors.otp.message}
                  </p>
                )}
              </div>
              <div className="flex flex-column mb-2">
                <label
                  htmlFor="newPassword"
                  className={`mb-1 ${sharedStyles.formLabel}`}
                >
                  New Password
                </label>
                <InputText
                  {...register("newPassword")}
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  className={`${errors.newPassword && "p-invalid"} ${
                    sharedStyles.formInput
                  }`}
                />
                {errors.newPassword && (
                  <p className={`mt-1 mb-0 ml-2 ${sharedStyles.errorMessage}`}>
                    {errors.newPassword.message}
                  </p>
                )}
              </div>
              <Button
                label="Reset Password"
                type="submit"
                className={`bg-bluegray-800 hover:bg-bluegray-900 mt-3 mb-1 w-full ${sharedStyles.button}`}
              />
            </form>
            <div
              className={`flex align-items-center justify-content-start mt-2 ${sharedStyles.Link}`}
            >
              <span>Didn't receive the code?&nbsp;</span>
              {showResend ? (
                <Button
                  link
                  onClick={handleResend}
                  role="button"
                  className={`p-0 text-blue-500 hover:text-blue-700 ${sharedStyles.Link}`}
                >
                  Resend OTP
                </Button>
              ) : (
                <div>Resend OTP in {timer}s</div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default PasswordResetPage;

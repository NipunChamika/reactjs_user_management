import { z } from "zod";
import { emailSchema } from "./validation/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext, useRef } from "react";
import { UserContext } from "../context";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import sharedStyles from "./SharedStyles.module.css";

type EmailEntryFormData = z.infer<typeof emailSchema>;

const EmailEntryPage = () => {
  const userContext = useContext(UserContext);

  if (userContext === undefined) {
    console.log("UserContext not available.");
    return null;
  }

  const { setEmail, setError } = userContext;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailEntryFormData>({ resolver: zodResolver(emailSchema) });

  const navigate = useNavigate();

  const toast = useRef<Toast>(null);

  const onSubmit = (data: EmailEntryFormData) => {
    // console.log(data.email);

    axios
      .post("http://localhost:3000/user/forgot-password", data)
      .then((res) => {
        setEmail(data);
        console.log(res.data);
        setError("");
        navigate("/password-reset");
      })
      .catch((err) => {
        console.log(err);
        // if (err.response.status === 404) {
        //   setError("User with the email not found");
        // }

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
    <div className={sharedStyles.cardTitle}>Email Verification</div>
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
          <p className="-mt-3 mb-5">
            Reset your password by providing your account email below.
          </p>
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
                autoFocus
              />
              {errors.email && (
                <p className={`mt-1 mb-0 ml-2 ${sharedStyles.errorMessage}`}>
                  {errors.email.message}
                </p>
              )}
            </div>
            <Button
              label="Next"
              type="submit"
              className={`bg-bluegray-800 hover:bg-bluegray-900 mt-3 mb-1 w-full ${sharedStyles.button}`}
            />
          </form>
          <div className={`mt-2 ${sharedStyles.Link}`}>
            Remember the password?&nbsp;
            <Button
              link
              onClick={() => navigate("/")}
              className={`p-0 text-blue-500 hover:text-blue-700 ${sharedStyles.Link}`}
            >
              Log in
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
};

export default EmailEntryPage;

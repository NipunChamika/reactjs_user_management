import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { signupSchema } from "./validation/validation";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Tooltip } from "primereact/tooltip";
import sharedStyles from "./SharedStyles.module.css";
import { UserContext } from "../context";

type SignupFormData = z.infer<typeof signupSchema>;

const SignUpUser = () => {
  const userContext = useContext(UserContext);

  if (userContext === undefined) {
    console.log("UserContext not available.");
    return null;
  }

  const { setIsSignupSuccess } = userContext;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({ resolver: zodResolver(signupSchema) });

  const navigate = useNavigate();

  const toast = useRef<Toast>(null);

  const onSubmit = (data: SignupFormData) => {
    const newUser = data;
    axios
      .post("http://localhost:3000/user/", newUser)
      .then((res) => {
        console.log(res.data);
        setIsSignupSuccess(true);
        navigate("/");
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
              detail: "Sign up Failed",
              life: 3000,
            });
          }
        }
      });
  };

  const cardTitle = <div className={sharedStyles.cardTitle}>Sign up</div>;

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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-column mb-2">
              <label
                htmlFor="firstName"
                className={`mb-1 ${sharedStyles.formLabel}`}
              >
                First Name
              </label>
              <InputText
                {...register("firstName")}
                id="firstName"
                placeholder="Enter your first name"
                className={`${errors.firstName && "p-invalid"} ${
                  sharedStyles.formInput
                }`}
              />
              {errors.firstName && (
                <p className={`mt-1 mb-0 ml-2 ${sharedStyles.errorMessage}`}>
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="flex flex-column mb-2">
              <label
                htmlFor="lastName"
                className={`mb-1 ${sharedStyles.formLabel}`}
              >
                Last Name
              </label>
              <InputText
                {...register("lastName")}
                id="lastName"
                placeholder="Enter your last name"
                className={`${errors.lastName && "p-invalid"} ${
                  sharedStyles.formInput
                }`}
              />
              {errors.lastName && (
                <p className={`mt-1 mb-0 ml-2 ${sharedStyles.errorMessage}`}>
                  {errors.lastName.message}
                </p>
              )}
            </div>
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
              {errors.email && (
                <p className={`mt-1 mb-0 ml-2 ${sharedStyles.errorMessage}`}>
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="flex flex-column mb-2">
              <label
                htmlFor="password"
                className={`mb-1 ${sharedStyles.formLabel}`}
              >
                Password&nbsp;
                <i
                  className={`pi pi-info-circle ${sharedStyles.toolTipFont}`}
                  data-pr-tooltip="Password must be at least 8 characters long"
                  data-pr-position="right"
                />
                <Tooltip target=".pi-info-circle" />
              </label>
              <InputText
                {...register("password")}
                id="password"
                type="password"
                placeholder="Enter your password"
                className={`${errors.password && "p-invalid"} ${
                  sharedStyles.formInput
                }`}
              />
              {errors.password && (
                <p className={`mt-1 mb-0 ml-2 ${sharedStyles.errorMessage}`}>
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              label="Sign up"
              type="submit"
              className={`bg-bluegray-800 hover:bg-bluegray-900 mt-3 mb-1 w-full ${sharedStyles.button}`}
            />
          </form>
          <div className={`mt-2 ${sharedStyles.Link}`}>
            Already have an account?&nbsp;
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

export default SignUpUser;

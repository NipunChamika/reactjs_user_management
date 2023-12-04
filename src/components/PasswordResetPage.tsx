import { useContext } from "react";
import { UserContext } from "../context";
import { passwordResetSchema } from "./validation/validation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type PasswordResetFormData = z.infer<typeof passwordResetSchema>;

const PasswordResetPage = () => {
  const userContext = useContext(UserContext);
  // console.log(userContext);

  if (userContext === undefined) {
    console.log("UserContext not available.");
    return null;
  }

  const { email, setEmail, error, setError } = userContext;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordResetFormData>({
    resolver: zodResolver(passwordResetSchema),
  });

  const navigate = useNavigate();

  const onSubmit = (data: PasswordResetFormData) => {
    const payload = {
      ...data,
      email: email,
    };

    // console.log(payload);

    axios
      .post("http://localhost:3000/user/reset-password", payload)
      .then((res) => {
        console.log(res.data);
        setEmail("");
        setError("");
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

  return (
    <>
      <div className="bg-dark vh-100 d-flex justify-content-center align-items-center">
        <div className="shadow-sm bg-light bg-gradient p-3 w-25 rounded">
          {error && <p className="text-danger">{error}</p>}
          <h3 className="mb-2">Reset Password</h3>
          <p>
            We have sent a code to <strong>{email}</strong>
          </p>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-2">
                <label htmlFor="otp" className="form-label mb-1">
                  OTP
                </label>
                <input
                  {...register("otp")}
                  id="otp"
                  type="text"
                  className="form-control"
                  maxLength={4}
                />
                {errors.otp && (
                  <p className="text-danger">{errors.otp.message}</p>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="newPassword">New Password</label>
                <input
                  {...register("newPassword")}
                  id="newPassword"
                  type="password"
                  className="form-control mt-2"
                />
                {errors.newPassword && (
                  <p className="text-danger">{errors.newPassword.message}</p>
                )}
              </div>
              <button type="submit" className="btn btn-primary">
                Reset
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PasswordResetPage;

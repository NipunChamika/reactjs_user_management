import { z } from "zod";
import { emailSchema } from "./validation/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context";

type EmailEntryFormData = z.infer<typeof emailSchema>;

const EmailEntryPage = () => {
  const userContext = useContext(UserContext);

  if (userContext === undefined) {
    console.log("UserContext not available.");
    return null;
  }

  const { setEmail } = userContext;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailEntryFormData>({ resolver: zodResolver(emailSchema) });

  const navigate = useNavigate();

  const onSubmit = (data: EmailEntryFormData) => {
    // console.log(data.email);

    axios
      .post("http://localhost:3000/user/forgot-password", data)
      .then((res) => {
        setEmail(data.email);
        console.log(res.data);
        navigate("/password-reset");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="bg-dark vh-100 d-flex justify-content-center align-items-center">
        <div className="shadow-sm bg-light bg-gradient p-3 w-25 rounded">
          <h3 className="mb-2">Email Verification</h3>
          <p className="mb-3">
            Reset your password by providing your account email below.
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label mb-1">
                Email
              </label>
              <input
                {...register("email")}
                id="email"
                type="text"
                className="form-control mb-4"
                autoFocus
              />
              {errors.email && (
                <p className="text-danger">{errors.email.message}</p>
              )}
              <button type="submit" className="btn btn-primary">
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EmailEntryPage;

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { signupSchema } from "./validation/validation";

type SignupFormData = z.infer<typeof signupSchema>;

const SignUpUser = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({ resolver: zodResolver(signupSchema) });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = (data: SignupFormData) => {
    const newUser = data;
    axios
      .post("http://localhost:3000/user/", newUser)
      .then((res) => {
        console.log(res.data);
        navigate("/");
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
  };

  return (
    <>
      <div className="bg-dark vh-100 d-flex justify-content-center align-items-center">
        <div className="shadow-sm bg-light bg-gradient p-3 w-25 rounded">
          {error && <p className="text-danger">{error}</p>}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">
                <strong>First Name</strong>
              </label>
              <input
                {...register("firstName")}
                id="firstName"
                type="text"
                className="form-control"
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <p className="text-danger">{errors.firstName.message}</p>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">
                <strong>Last Name</strong>
              </label>
              <input
                {...register("lastName")}
                id="lastName"
                type="text"
                className="form-control"
                placeholder="Enter your lastName"
              />
              {errors.lastName && (
                <p className="text-danger">{errors.lastName.message}</p>
              )}
            </div>
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
            <button type="submit" className="btn btn-success w-100 mb-1">
              Submit
            </button>
          </form>
          <button
            className="btn btn-outline-primary w-100"
            onClick={() => navigate("/")}
          >
            Login
          </button>
        </div>
      </div>
    </>
  );
};

export default SignUpUser;

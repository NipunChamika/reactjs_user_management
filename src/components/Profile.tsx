import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import { UserContext } from "../context";
import { z } from "zod";
import { updateUserSchema } from "./validation/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface Props {}

type UpdateFormData = z.infer<typeof updateUserSchema>;

const Profile = ({}: Props) => {
  const navigate = useNavigate();

  const [shouldRefetch, setShouldRefetch] = useState(false);

  const userContext = useContext(UserContext);
  // console.log(userContext);

  if (userContext === undefined) {
    console.log("UserContext not available.");
    return null;
  }

  const {
    userId,
    setUser,
    user,
    setError,
    error,
    setIsLoggedIn,
    setRefreshExpiredError,
  } = userContext;

  const accessToken = localStorage.getItem("accessToken");

  const config = { headers: { Authorization: `Bearer ${accessToken}` } };

  useEffect(() => {
    if (!accessToken) {
      navigate("/");
      return;
    }

    // const config = { headers: { Authorization: `Bearer ${accessToken}` } };

    axios
      .get("http://localhost:3000/user/" + userId, config)
      .then((res) => {
        setUser(res.data.user);
        // console.log("Updated user: ", user);
      })
      .catch((err) => {
        console.log(err);

        if (err.message === "Network Error") {
          setError(err.message);
        } else if (err.response) {
          setError(err.response.data.message);
        } else {
          setError("Something went wrong");
        }
      });
  }, [accessToken, shouldRefetch]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");

    const refreshToken = localStorage.getItem("refreshToken");

    axios
      .post("http://localhost:3000/user/logout", { refreshToken })
      .then((res) => {
        console.log(res.data);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        console.log("Access Token: ", accessToken);
        console.log("Refresh Token: ", refreshToken);

        setIsLoggedIn(false);
        navigate("/");
      })
      .catch((err) => {
        if (err.message === "Network Error") {
          setError(err.message);
        } else if (err.response) {
          setError(err.response.data.message);
        } else {
          setError("Logout failed");
        }
      });
  };

  // ===================================================================================

  const [updateUser, setUpdateUser] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateFormData>({ resolver: zodResolver(updateUserSchema) });

  const onSubmit = (data: UpdateFormData) => {
    console.log(data);
    console.log(userId);

    // Filter out empty fields before calling the API
    const updatedData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== "")
    );

    axios
      .patch("http://localhost:3000/user/" + userId, updatedData, config)
      .then((res) => {
        setUser(res.data.user);
        setShouldRefetch(true);
        setUpdateUser(false);
      })
      .catch((err) => {
        console.log(err);

        if (err.message === "Network Error") {
          setError(err.message);
        } else if (err.response) {
          setError(err.response.data.message);
        } else {
          setError("Something went wrong");
        }
      });
  };

  const handleRefreshToken = () => {
    const refreshToken = localStorage.getItem("refreshToken");

    // console.log(refreshToken);

    axios
      .post("http://localhost:3000/user/token", { refreshToken: refreshToken })
      .then((res) => console.log("New accessToken: ", res.data.accessToken))
      .catch((err) => {
        // console.log(err);
        if (err.response.status === 401) {
          setRefreshExpiredError("Session expired. Please log in again.");
          handleLogout();
        } else if (err.message === "Network Error") {
          setError(err.message);
        } else if (err.response) {
          setError(err.response.data.message);
        } else {
          console.log("An unexpected error occured: ", err);
          setError(err.message || "An unexpected error occured");
        }
      });
  };

  return (
    <>
      <div className="bg-dark vh-100 d-flex justify-content-center align-items-center">
        <div className="bg-light p-3 w-25 vh-90 rounded shadow-sm overflow-auto">
          {error && <p className="text-danger">{error}</p>}
          <h1 className="text-center mb-3">{`Welcome Back, ${user?.firstName}`}</h1>
          <h5>Profile Details</h5>
          <div>
            <p>Name: {user?.firstName + " " + user?.lastName}</p>
            <p>Email: {user?.email}</p>
          </div>
          <div className="d-flex">
            <button
              className="btn btn-outline-primary me-2"
              onClick={() => {
                setUpdateUser(true);
                setShouldRefetch(false);
              }}
            >
              Update
            </button>
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              Logout
            </button>
            <button
              className="btn btn-primary ms-auto"
              onClick={handleRefreshToken}
            >
              Refresh Token
            </button>
          </div>

          {/* =========================================================================== */}

          {updateUser && (
            <div>
              <br />
              <h1 className="text-center mb-3">User Update</h1>
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
                <button
                  type="submit"
                  className="btn btn-outline-primary mb-1 me-2"
                >
                  Submit
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setUpdateUser(false)}
                >
                  Cancel
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;

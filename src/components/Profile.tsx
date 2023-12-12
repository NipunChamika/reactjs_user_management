import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context";
import { z } from "zod";
import { updateUserSchema } from "./validation/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import sharedStyles from "./SharedStyles.module.css";
import { Card } from "primereact/card";
import UserProfile from "../assets/profile.png";
import styles from "./Profile.module.css";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

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
          // This displays the token has expired: which is not intended for this component
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

  const [updateError, setUpdateError] = useState("");

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

    if (Object.keys(updatedData).length === 0) {
      setUpdateError("Please fill in at least one field to update.");
      return;
    }

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

  const cardTitle = (
    <div className={sharedStyles.cardTitle}>{`Welcome ${user.firstName}`}</div>
  );

  return (
    <>
      <div
        className={`h-screen flex justify-content-center align-items-center ${sharedStyles.container}`}
      >
        <Card
          // title={cardTitle}
          className={`shadow-3 bg-white p-3 ${sharedStyles.cardContainer}`}
        >
          {/* ====================================== */}

          <div className="flex flex-row">
            <div className="flex align-items-center justify-content-center">
              <img
                src={UserProfile}
                alt="Profile"
                className={styles.profileImageWrapper}
                // style={{ maxWidth: "125px", marginRight: "26px" }}
              />
            </div>
            <div className="flex align-items-center justify-content-center">
              <div className="flex flex-column">
                <div
                  className={`flex align-items-center justify-content-start ${sharedStyles.cardTitle}`}
                >
                  {`Welcome ${user.firstName}!`}
                </div>
                <div className="flex align-items-center justify-content-start">
                  <div className={`mt-1 ${styles.profileTextWrapper}`}>
                    Please enter your login details below
                  </div>
                </div>
                <div
                  className={`flex align-items-center justify-content-start`}
                >
                  <Button
                    link
                    className={`p-0 mt-2 text-red-400 hover:text-red-600 ${styles.logoutButtonLink}`}
                    onClick={handleLogout}
                  >
                    Log out
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row">
            <div className={`mt-4 mb-3 ${styles.profileDetailsHeader}`}>
              Profile Details
            </div>
          </div>

          {/* <div className="flex flex-row">
            <div className="flex align-items-baseline">
              <div className={`${styles.profileDetailsHeader}`}>Name</div>
              <div className={`mx-3 ${styles.profileDetailsHeader}`}>:</div>
              <div className={`${styles.profileDetailsResult}`}>
                {user?.firstName + " " + user?.lastName}
              </div>
            </div>
          </div>

          <div className="flex flex-row">
            <div className="flex align-items-baseline">
              <div className={`${styles.profileDetailsHeader}`}>Email</div>
              <div className={`mx-3 ${styles.profileDetailsHeader}`}>:</div>
              <div className={`${styles.profileDetailsResult}`}>
                {user?.email}
              </div>
            </div>
          </div> */}

          {/* <div className="flex flex-row"> */}
          <div className="grid mb-1">
            <div className="col-2 flex align-items-baseline">
              <div className={`${styles.profileDetailsHeader}`}>Name</div>
            </div>
            <div className="col-1 flex align-items-baseline">
              <div className={`${styles.profileDetailsHeader}`}>:</div>
            </div>
            <div className="col-9 flex align-items-baseline">
              <div className={`${styles.profileDetailsResult}`}>
                {user?.firstName + " " + user?.lastName}
              </div>
            </div>
          </div>

          <div className="grid mb-5">
            <div className="col-2 flex align-items-baseline">
              <div className={styles.profileDetailsHeader}>Email</div>
            </div>
            <div className="col-1 flex align-items-baseline">
              <div className={styles.profileDetailsHeader}>:</div>
            </div>
            <div className="col-9 flex align-items-baseline">
              <div className={styles.profileDetailsResult}>{user?.email}</div>
            </div>
          </div>
          {/* </div> */}

          {/* ======================================================== */}
          {/* {error && <p className="text-danger">{error}</p>} */}
          {/* <h1 className="text-center mb-3">{`Welcome Back, ${user?.firstName}`}</h1> */}
          {/* <h5>Profile Details</h5>
          <div>
            <p>Name: {user?.firstName + " " + user?.lastName}</p>
            <p>Email: {user?.email}</p>
          </div> */}
          <div className="flex align-items-center justify-content-between">
            <Button
              label="Update"
              severity="secondary"
              outlined
              className={`border-bluegray-700 hover:border-bluegray-900 w-10rem text-bluegray-700 hover:text-bluegray-900 ${styles.profileButton}`}
              onClick={() => {
                setUpdateUser(true);
                setShouldRefetch(false);
              }}
            />

            {/* <Button
              label="Update"
              severity="secondary"
              outlined
              className={`border-bluegray-700 hover:border-bluegray-900 w-10rem text-bluegray-700 hover:text-bluegray-900 ${styles.profileButton}`}
              onClick={() => {
                setUpdateUser(true);
                setShouldRefetch(false);
              }}
            /> */}

            <Button
              label="Refresh Token"
              className={`bg-bluegray-800 hover:bg-bluegray-900 border-bluegray-800 hover:border-bluegray-900 w-10rem ${styles.profileButton}`}
              onClick={handleRefreshToken}
            />
          </div>

          {/* =============================== */}

          <Dialog
            header={
              <div className="flex justify-content-center align-items-center">
                Update Details
              </div>
            }
            visible={updateUser}
            onHide={() => setUpdateUser(false)}
            style={{ width: "35vw" }}
            // contentStyle={{ borderRadius: "20px" }}
            // className={styles.customDialog}
            draggable={false}
            dismissableMask
          >
            <div className={`flex justify-content-center align-items-center`}>
              {/* {updateError && <p className="text-danger">{updateError}</p>} */}
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
                  onClick={() => {
                    setUpdateUser(false);
                    setUpdateError("");
                  }}
                >
                  Cancel
                </button>
              </form>
            </div>
          </Dialog>

          {/* =========================================================================== */}

          {/* {updateUser && (
            <div>
              <br />
              {updateError && <p className="text-danger">{updateError}</p>}
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
                  onClick={() => {
                    setUpdateUser(false);
                    setUpdateError("");
                  }}
                >
                  Cancel
                </button>
              </form>
            </div>
          )} */}
        </Card>
      </div>
    </>
  );
};

export default Profile;

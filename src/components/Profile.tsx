import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context";
import { z } from "zod";
import { updateUserSchema } from "./validation/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Tooltip } from "primereact/tooltip";
import UserProfile from "../assets/profile.png";
import sharedStyles from "./SharedStyles.module.css";
import styles from "./Profile.module.css";

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

  const { setUser, user, setError, setIsLoggedIn, setRefreshExpiredError } =
    userContext;

  const accessToken = localStorage.getItem("accessToken");

  const id = localStorage.getItem("id");

  const config = { headers: { Authorization: `Bearer ${accessToken}` } };

  useEffect(() => {
    if (!accessToken) {
      navigate("/");
      return;
    }

    // const config = { headers: { Authorization: `Bearer ${accessToken}` } };

    // Earlier userId was the endpoint
    axios
      .get("http://localhost:3000/user/" + id, config)
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

  // const [updateError, setUpdateError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateFormData>({ resolver: zodResolver(updateUserSchema) });

  const toast = useRef<Toast>(null);

  const onSubmit = (data: UpdateFormData) => {
    console.log(data);
    // console.log(userId);

    // Filter out empty fields before calling the API
    const updatedData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== "")
    );

    if (Object.keys(updatedData).length === 0) {
      // setUpdateError("Please fill in at least one field to update.");

      if (toast.current) {
        toast.current.show({
          severity: "info",
          summary: "Info",
          detail: "Please fill in at least one field to update.",
          life: 3000,
        });
      }

      return;
    }

    axios
      .patch("http://localhost:3000/user/" + id, updatedData, config)
      .then((res) => {
        setUser(res.data.user);
        setShouldRefetch(true);
        setUpdateUser(false);

        if (toast.current) {
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "User details updated successfully",
            life: 3000,
          });
        }
      })
      .catch((err) => {
        console.log(err);

        if (err.message === "Network Error") {
          // setError(err.message);
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
          // setError("Something went wrong");
          if (toast.current) {
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: "Something went wrong",
              life: 3000,
            });
          }
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
      <Toast ref={toast} />
      <div
        className={`h-screen flex justify-content-center align-items-center ${sharedStyles.container}`}
      >
        <Card className={`shadow-3 bg-white p-3 ${sharedStyles.cardContainer}`}>
          <div className="flex flex-row">
            <div className="flex align-items-center justify-content-center">
              <img
                src={UserProfile}
                alt="Profile"
                className={styles.profileImageWrapper}
              />
            </div>
            <div className="flex align-items-center justify-content-center">
              <div className="flex flex-column">
                <div
                  className={`flex align-items-center justify-content-start ${sharedStyles.cardTitle}`}
                >
                  {`Welcome ${user?.firstName}!`}
                </div>
                <div className="flex align-items-center justify-content-start">
                  <div
                    className={`mt-1 max-w-17rem ${styles.profileTextWrapper}`}
                    style={{ whiteSpace: "normal" }}
                  >
                    Take a look at your profile details below
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

          {/* <div className="flex flex-row"> */}
          <div className="grid mb-1">
            <div className="col-2 flex align-items-center">
              <div className={`${styles.profileDetailsHeader}`}>Name</div>
            </div>
            <div className="col-1 flex align-items-center">
              <div className={`${styles.profileDetailsHeader}`}>:</div>
            </div>
            <div className="col-9 flex align-items-center">
              <div className={`${styles.profileDetailsResult}`}>
                {user?.firstName + " " + user?.lastName}
              </div>
            </div>
          </div>

          <div className="grid mb-5">
            <div className="col-2 flex align-items-center">
              <div className={styles.profileDetailsHeader}>Email</div>
            </div>
            <div className="col-1 flex align-items-center">
              <div className={styles.profileDetailsHeader}>:</div>
            </div>
            <div className="col-9 flex align-items-center">
              <div className={styles.profileDetailsResult}>{user?.email}</div>
            </div>
          </div>
          {/* </div> */}

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

            <Button
              label="Refresh Token"
              className={`bg-bluegray-800 hover:bg-bluegray-900 border-bluegray-800 hover:border-bluegray-900 w-10rem ${styles.profileButton}`}
              onClick={handleRefreshToken}
            />
          </div>

          {/* =============================== */}

          <Dialog
            header={
              <div
                className={`flex justify-content-center align-items-center mt-5 pl-4 ${sharedStyles.cardTitle}`}
              >
                Update Details
              </div>
            }
            visible={updateUser}
            onHide={() => {
              setUpdateUser(false);
              // setUpdateError("");
            }}
            style={{ width: "35vw" }}
            contentStyle={{ padding: "0px 36px" }}
            // className={styles.customDialog}
            draggable={false}
            dismissableMask
            footer={<div className="mb-5"></div>}
          >
            <div className={`flex flex-column`}>
              {/* {updateError && <p className="text-danger">{updateError}</p>} */}
              <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                <div className="field mb-3">
                  <label
                    htmlFor="firstName"
                    className={`${sharedStyles.formLabel}`}
                  >
                    First Name
                  </label>
                  <InputText
                    {...register("firstName")}
                    id="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    className={`${errors.firstName && "p-invalid"} ${
                      sharedStyles.formInput
                    }`}
                  />
                  {errors.firstName && (
                    <p
                      className={`mt-1 mb-0 ml-2 ${sharedStyles.errorMessage}`}
                    >
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="field mb-3">
                  <label
                    htmlFor="lastName"
                    className={`${sharedStyles.formLabel}`}
                  >
                    Last Name
                  </label>
                  <InputText
                    {...register("lastName")}
                    id="lastName"
                    type="text"
                    placeholder="Enter your lastName"
                    className={`${errors.lastName && "p-invalid"} ${
                      sharedStyles.formInput
                    }`}
                  />
                  {errors.lastName && (
                    <p
                      className={`mt-1 mb-0 ml-2 ${sharedStyles.errorMessage}`}
                    >
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
                <div className="field mb-3">
                  <label
                    htmlFor="email"
                    className={`${sharedStyles.formLabel}`}
                  >
                    Email
                  </label>
                  <InputText
                    {...register("email")}
                    id="email"
                    type="text"
                    placeholder="Enter your email"
                    className={`${errors.email && "p-invalid"} ${
                      sharedStyles.formInput
                    }`}
                  />
                  {errors.email && (
                    <p
                      className={`mt-1 mb-0 ml-2 ${sharedStyles.errorMessage}`}
                    >
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="field mb-3">
                  <label
                    htmlFor="password"
                    className={`${sharedStyles.formLabel}`}
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
                    <p
                      className={`mt-1 mb-0 ml-2 ${sharedStyles.errorMessage}`}
                    >
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <Button
                  label="Submit"
                  type="submit"
                  className={`bg-bluegray-800 hover:bg-bluegray-900 border-bluegray-800 hover:border-bluegray-900 w-full mt-3 py-3 ${styles.profileButton}`}
                />
              </form>
              <div className="flex justify-content-center mt-2">
                <Button
                  label="Cancel"
                  outlined
                  severity="secondary"
                  className={`w-full py-3 ${styles.profileButton}`}
                  onClick={() => {
                    setUpdateUser(false);
                    // setUpdateError("");
                  }}
                />
              </div>
            </div>
          </Dialog>
        </Card>
      </div>
    </>
  );
};

export default Profile;

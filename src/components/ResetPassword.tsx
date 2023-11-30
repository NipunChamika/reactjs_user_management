import { useContext } from "react";
import { UserContext } from "../context";

const ResetPassword = () => {
  const userContext = useContext(UserContext);

  if (userContext === undefined) {
    console.log("UserContext not available.");
    return null;
  }

  const {} = userContext;

  return (
    <>
      <div className="d-flex">
        <p className="ms-auto px-0 link-underline-secondary pt-2">
          <u>Forgot your password?</u>
        </p>
      </div>
    </>
  );
};

export default ResetPassword;

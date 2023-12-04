import { useContext } from "react";
import { UserContext } from "../context";
import { Link } from "react-router-dom";

const ForgotPasswordLink = () => {
  const userContext = useContext(UserContext);

  if (userContext === undefined) {
    console.log("UserContext not available.");
    return null;
  }

  const {} = userContext;

  return (
    <>
      <div className="d-flex">
        <Link to="/email" className="ms-auto px-0 pt-2">
          Forgot password?
        </Link>
      </div>
    </>
  );
};

export default ForgotPasswordLink;

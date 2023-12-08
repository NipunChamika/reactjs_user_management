import { useContext } from "react";
import { UserContext } from "../context";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";

const ForgotPasswordLink = () => {
  const userContext = useContext(UserContext);

  if (userContext === undefined) {
    console.log("UserContext not available.");
    return null;
  }

  const {} = userContext;

  const navigate = useNavigate();

  return (
    <>
      <div className="flex align-items-center justify-content-end">
        <Button
          label="Forgot password?"
          link
          className="p-0"
          style={{ fontSize: "12px" }}
          onClick={() => navigate("/email")}
        />
      </div>
    </>
  );
};

export default ForgotPasswordLink;

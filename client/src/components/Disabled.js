import React from "react";
import { useNavigate } from "react-router-dom";

const Disabled = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h2>Account disabled</h2>
      <br />
      <p>Your account has been disabled, please contact Administrator.</p>
      <div className="flexGrow">
      </div>
    </div>
  );
};

export default Disabled;

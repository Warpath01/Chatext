import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

const AuthLayout = () => {
  const location = useLocation();
  const hideButtons =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className=" p-5 w-100" style={{ height: "500px" }}>
      <div
        className={`d-flex flex-column justify-content-around align-items-center ${
          !hideButtons && "h-100  justify-content-evenly"
        }`}
        style={{ maxHeight: "500px" }}
      >
        <span className="fw-bold fs-3 text-primary mb-2 mt-4">
          Welcome To Chatext
        </span>
        <Outlet />
        {!hideButtons && (
          <div className="mb-4 d-flex gap-3">
            <Link to="/login" className="btn btn-success">
              Log In
            </Link>
            <Link to="/signup" className="btn btn-primary">
              Sign up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthLayout;

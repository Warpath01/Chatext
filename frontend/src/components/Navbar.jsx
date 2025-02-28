import React from "react";
import { useAuthStore } from "../store/auth.store";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { logout } = useAuthStore();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <div>
      <nav className="navbar navbar-light bg-light border-bottom p-1 ">
        <Link
          to="/"
          className=" btn btn-outline-primary"
          href="#"
          style={{ width: "100px" }}
        >
          Home
        </Link>
        <Link to="/chat" className="btn btn-outline-primary ">
          Chat
        </Link>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Log Out
        </button>
      </nav>
    </div>
  );
};

export default Navbar;

import React, { useState } from "react";
import { useAuthStore } from "../store/auth.store";
import { Link, useNavigate } from "react-router-dom"; // Import Link

const Signup = () => {
  const { signup, setIsLoading } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
    navigate("/login");
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card p-4 shadow"
        style={{ width: "500px", height: "500px" }}
      >
        <h3 className="text-center mb-3" style={{ fontSize: "1.5rem" }}>
          Signup
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label
              htmlFor="email"
              className="form-label"
              style={{ fontSize: "0.9rem" }}
            >
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="firstName"
              className="form-label"
              style={{ fontSize: "0.9rem" }}
            >
              First Name
            </label>
            <input
              type="text"
              className="form-control"
              id="firstName"
              placeholder="Enter first name"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="lastName"
              className="form-label"
              style={{ fontSize: "0.9rem" }}
            >
              Last Name
            </label>
            <input
              type="text"
              className="form-control"
              id="lastName"
              placeholder="Enter last name"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-3 position-relative">
            <label
              htmlFor="password"
              className="form-label"
              style={{ fontSize: "0.9rem" }}
            >
              Password
            </label>
            <div className="input-group">
              <input
                type={passwordVisible ? "text" : "password"}
                className="form-control"
                id="password"
                placeholder="Enter password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            style={{ fontSize: "1rem" }}
          >
            Signup
          </button>
        </form>
        <div className="mt-3 text-center">
          <p style={{ fontSize: "0.9rem" }}>
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-decoration-none"
              style={{ fontSize: "0.9rem" }}
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

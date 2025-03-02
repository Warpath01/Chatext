import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../store/auth.store";
import Users from "./Users";

const Sidebar = () => {
  const { updateProfile, checkAuth, authUser, getPersonalInfo } =
    useAuthStore();

  const handleUploadImg = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePic", file);

    await updateProfile(formData);
    checkAuth();
  };
  useEffect(() => {
    // checkAuth();
    // getPersonalInfo();
  }, []);

  return (
    <div
      className="bg-light p-3 border rounded d-flex flex-column"
      style={{
        width: "250px",
        height: "90vh",
        maxHeight: "90vh",
        overflow: "hidden",
      }}
    >
      {/* Profile Section */}
      <div
        className="d-flex flex-column align-items-center text-center mb-3"
        style={{ flex: "0 1 auto" }}
      >
        {/* Profile Picture */}
        <div className="position-relative">
          <div
            className="rounded-circle bg-secondary d-flex justify-content-center align-items-center overflow-hidden border shadow"
            style={{
              width: "100px",
              height: "100px",
              fontSize: "24px",
              color: "white",
            }}
          >
            {authUser.profilePic ? (
              <img
                src={`/profile-pics/${authUser.profilePic}`}
                alt="Profile"
                className="w-100 h-100 object-fit-cover"
              />
            ) : (
              <span>{authUser.fullName?.charAt(0)}</span>
            )}
          </div>

          {/* Update Button */}
          <div className="position-absolute bottom-0 end-0">
            <label
              className="btn btn-primary btn-sm rounded-circle d-flex align-items-center justify-content-center shadow"
              style={{ width: "35px", height: "35px", cursor: "pointer" }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadImg}
                className="d-none"
              />
            </label>
          </div>
        </div>

        {/* User Info */}
        <h6 className="mb-0 mt-2">{authUser.fullName}</h6>
        <p className="text-muted small">{authUser.email}</p>
      </div>

      {/* Online Users Section */}
      <div className="d-flex flex-column align-items-center flex-grow-1 py-2">
        <Users />
      </div>
    </div>
  );
};

export default Sidebar;

import React, { useEffect } from "react";
import ReactLogo from "../../assets/react.svg";
import { useHomeStore } from "../../store/home.store";
import { FiUsers } from "react-icons/fi";
import { useAuthStore } from "../../store/auth.store";

const Users = () => {
  const { users, getUsers } = useHomeStore();
  const { onlineContacts } = useAuthStore();

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <p
        className="d-flex flex-row justify-content-center w-100 border rounded shadow-sm align-items-center"
        style={{ gap: "10px" }}
      >
        Online Users :{" "}
        <span>
          {users.filter((user) => onlineContacts.includes(user._id)).length}
        </span>
      </p>
      <ul
        className="list-group p-2"
        style={{
          width: "100%",
          maxHeight: "280px",
          overflowY: "auto",
          gap: "10px",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {users.length > 0 ? (
          users.map((user) => (
            <li
              key={user._id}
              className="d-flex align-items-center"
              style={{
                gap: "10px",
                padding: "10px",
                transition: "0.3s",
                position: "relative", // Add this
              }}
            >
              <div
                className="rounded-circle bg-secondary d-flex justify-content-center align-items-center shadow"
                style={{
                  width: "35px",
                  height: "35px",
                  fontSize: "16px",
                  color: "white",
                  position: "relative", // Add this
                }}
              >
                {user.profilePic ? (
                  <img
                    src={`/profile-pics/${user.profilePic}`}
                    alt="Profile"
                    className="rounded-circle"
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : (
                  <span>{user.fullName?.charAt(0)}</span>
                )}
              </div>

              <span className="fw-bold text-dark">{user.fullName}</span>
              {onlineContacts.includes(user._id) && (
                <span
                  style={{
                    width: "13px",
                    height: "13px",
                    backgroundColor: "#22c55e", // Equivalent to bg-green-500
                    borderRadius: "50%",
                    position: "absolute",
                    left: "2.2rem",
                    bottom: "6px",
                    border: "2px solid white",
                  }}
                ></span>
              )}
            </li>
          ))
        ) : (
          <p className="text-muted text-center">No users found.</p>
        )}
      </ul>
    </>
  );
};

export default Users;

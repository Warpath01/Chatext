import React, { useEffect } from "react";
import logo from "../../assets/react.svg";
import { useChatStore } from "../../store/chat.store";
import { useAuthStore } from "../../store/auth.store";

import { FiUsers } from "react-icons/io5";

const Users = () => {
  const { users, getUsers, selectedUser, setSelectedUser } = useChatStore();
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
        Online Contacts :{" "}
        <span>
          {users.filter((user) => onlineContacts.includes(user._id)).length}
        </span>
      </p>

      <ul
        className="list-group"
        style={{
          width: "100%",
          maxHeight: "90vh",
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
              className={` d-flex align-items-center btn px-4
            ${selectedUser?._id === user._id ? "btn-secondary " : "btn-light"}`}
              style={{
                gap: "10px",
                padding: "10px",
                transition: "0.3s",
                position: "relative", // Add this
              }}
              onClick={(e) => setSelectedUser(user)}
            >
              <div
                className="rounded-circle bg-secondary d-flex justify-content-center align-items-center"
                style={{
                  width: "25px",
                  height: "25px",
                  fontSize: "15px",
                  color: "white",
                  position: "relative", // Add this
                }}
              >
                {user.profilePic ? (
                  <img
                    src={`/profile-pics/${user.profilePic}`}
                    alt="Profile"
                    className="rounded-circle"
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "relative",
                    }}
                  />
                ) : (
                  <span>{user.fullName?.charAt(0)}</span>
                )}
              </div>
              {user.fullName}
              {onlineContacts.includes(user._id) && (
                <span
                  style={{
                    width: "13px",
                    height: "13px",
                    backgroundColor: "#22c55e", // Equivalent to bg-green-500
                    borderRadius: "50%",
                    position: "absolute",
                    left: "2.5rem",
                    bottom: "4px",
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

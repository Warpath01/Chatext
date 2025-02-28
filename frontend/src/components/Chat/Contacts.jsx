import React, { useEffect, useState } from "react";
import Users from "./Users";
import { useChatStore } from "../../store/chat.store";

const Contacts = () => {
  const { setSelectedUser, setSelectWorldChat } = useChatStore();

  const handleSelectedUser = () => {
    setSelectedUser(null);
    setSelectWorldChat(true);
  };
  useEffect(() => {}, []);

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
      <button
        className="btn btn-outline-success  text-center fs-5"
        onClick={handleSelectedUser}
      >
        World Chat
      </button>
      <hr className="w-100" />

      {/* Online Users Section */}
      <div className="d-flex flex-column align-items-center flex-grow-1 py-2">
        <Users />
      </div>
    </div>
  );
};

export default Contacts;

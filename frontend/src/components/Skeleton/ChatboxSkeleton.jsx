import React from "react";

const ChatboxSkeleton = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-center "
      style={{ height: "80vh" }}
    >
      <div className="text-center border p-4 rounded shadow-sm">
        <i>
          <h3 className="text-muted">Welcome to Cha Text</h3>
        </i>
        <span className="text-secondary lead">
          Enjoy communicating with anyone
        </span>
      </div>
    </div>
  );
};

export default ChatboxSkeleton;

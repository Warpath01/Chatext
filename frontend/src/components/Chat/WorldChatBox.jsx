import React, { useEffect, useState } from "react";
import world from "../../assets/world.png";
import "bootstrap/dist/css/bootstrap.min.css";
import WorldMessages from "./WorldMessages";
import { useChatStore } from "../../store/chat.store";
import { MdOutlineForum } from "react-icons/io5";
import { useAuthStore } from "../../store/auth.store";
import { useRef } from "react";

const ChatBox = () => {
  const [message, setMessage] = useState({ text: "" });
  const { sendPublicMessages, messages } = useChatStore();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message || !message.text || !message.text.trim()) return;
    await sendPublicMessages(message);
    setMessage({ text: "" });
  };

  // console.log(message);

  return (
    <div className="container">
      <div className="card" style={{ width: "100%" }}>
        <div className="card-header bg-success text-white text-center fs-5 d-flex align-items-center justify-content-between ">
          <div className="d-flex align-items-center pl-5 w-100">
            <img
              src={world}
              alt="User Profile"
              className=" border rounded-circle me-2"
              width="45"
              height="45"
            />
            <div>
              <div className="fs-5">Welcome :</div>
            </div>
          </div>
        </div>

        <div
          className="card-body"
          style={{
            height: "425px",
            overflowY: "auto",
            padding: "20px",
            width: "100%",
            scrollbarWidth: "thin", // Firefox
            scrollbarColor: "#888 transparent", // Firefox thumb only
            msOverflowStyle: "none", // Hide default scrollbar for Edge

            /* Webkit-based (Chrome, Safari) */
            WebkitOverflowScrolling: "touch",

            /* Scrollbar styling for Webkit browsers */
            WebkitScrollbarWidth: "thin",
            WebkitScrollbar: { width: "8px" }, // Stick thickness
            WebkitScrollbarThumb: {
              backgroundColor: "green", // Stick color
              borderRadius: "20px", // Make it round
            },
            WebkitScrollbarTrack: {
              background: "transparent", // Hide track
            },
          }}
        >
          <WorldMessages />
        </div>
        <form onSubmit={handleSendMessage} className="card-footer d-flex">
          <input
            type="text"
            className="form-control me-2"
            value={message.text}
            onChange={(e) => setMessage({ ...message, text: e.target.value })}
            placeholder="Type a message..."
          />
          <button className="btn btn-primary">Send</button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;

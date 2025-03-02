import React, { useEffect, useRef } from "react";
import { useChatStore } from "../../store/chat.store";
import { useAuthStore } from "../../store/auth.store";
import { useHomeStore } from "../../store/home.store";
import logo from "../../assets/react.svg";

const Messages = () => {
  const {
    messages,
    getPersonalMessage,
    selectedUser,
    receiveMessage,
    unReceiveMessage,
  } = useChatStore();
  const { checkAuth } = useAuthStore();
  const { getUsers, users } = useHomeStore();

  const messageEndRef = useRef(null);

  useEffect(() => {
    getPersonalMessage(selectedUser._id);

    receiveMessage();
    getUsers();
    return () => unReceiveMessage();
  }, [selectedUser._id]);

  useEffect(() => {
    if (messageEndRef.current && messages)
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{ height: "100%", gap: "10px" }}>
      {messages.length > 0 ? (
        messages.map((message) => (
          <div
            key={message._id}
            className={`d-flex flex mt-4 ${
              message.senderId !== checkAuth._id
                ? "justify-content-start"
                : "justify-content-end"
            }`}
            ref={messageEndRef}
          >
            <div className="d-flex flex-column ">
              <i
                className={`mx-3 ${
                  users.some((user) => user._id === message.senderId)
                    ? "align-self-start"
                    : "align-self-end"
                }`}
              >
                <span>
                  {users.find((user) => user._id === message.senderId)
                    ?.firstName || "Self"}
                </span>
              </i>

              <div
                className={`p-2 mb-2 rounded-2xl border shadow-sm ${
                  users.some((user) => user._id === message.senderId)
                    ? "bg-light"
                    : "bg-primary text-white"
                }`}
                style={{
                  wordBreak: "break-word",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                  maxWidth: "400px",
                  ...(users.some(
                    (SomeUser) => SomeUser._id === message.senderId
                  )
                    ? {
                        borderTopRightRadius: "20px",
                        borderBottomRightRadius: "20px",
                        borderBottomLeftRadius: "20px",
                      }
                    : {
                        borderTopLeftRadius: "20px",
                        borderBottomRightRadius: "20px",
                        borderBottomLeftRadius: "20px",
                      }),
                }}
              >
                {users.some((user) => user._id === message.senderId) && (
                  <img
                    src={
                      users.find((user) => user._id === message.senderId)
                        ?.profilePic
                        ? `/profile-pics/${
                            users.find((user) => user._id === message.senderId)
                              ?.profilePic
                          }`
                        : logo
                    }
                    alt="User"
                    className="rounded-circle"
                    style={{ width: "36px", height: "36px" }}
                  />
                )}

                <div>
                  <p className="text-sm mx-2">{message.text}</p>
                  <small className="text-gray-500 text-xs block mt-1 mx-2">
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </small>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div style={{ textAlign: "center" }}>
          <span>-- No Messages --</span>
        </div>
      )}
    </div>
  );
};

export default Messages;

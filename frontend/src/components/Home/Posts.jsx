import ReactLogo from "../../assets/react.svg";
import { useHomeStore } from "../../store/home.store";
import React, { useEffect } from "react";
import moment from "moment";
import { useAuthStore } from "../../store/auth.store";

const Posts = () => {
  const { posts, getPosts } = useHomeStore();
  const { authUser, onlineContacts } = useAuthStore();

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div>
      {posts.map((post) => (
        <div className="card mb-5" style={{ width: "100%" }} key={post._id}>
          <div className="card-body">
            <div
              className="d-flex align-items-center mb-1 border-bottom"
              style={{ gap: "10px" }}
            >
              <div
                className="rounded-circle bg-secondary d-flex justify-content-center align-items-center mb-2"
                style={{
                  width: "70px",
                  height: "70px",
                  fontSize: "24px",
                  color: "white",
                }}
              >
                {authUser.profilePic ? (
                  <img
                    src={`/profile-pics/${authUser.profilePic}`}
                    alt="Profile"
                    className="rounded-circle"
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "relative",
                    }}
                  />
                ) : (
                  <span>{post.senderName?.charAt(0)}</span>
                )}
              </div>
              <div>
                <h5 className="mb-0 fw-bold text-primary">{post.senderName}</h5>
                <small className="text-muted">
                  {moment(post.createdAt).fromNow()}
                </small>
              </div>
            </div>
            <div className="p-3 m-0">
              <p className="fs-5 text-dark">{post.text}</p>
            </div>
            {post.image && (
              <div
                className="px-2"
                style={{
                  height: "300px",
                  width: "100%",
                }}
              >
                <img
                  src={`/post-pics/${post.image}`}
                  className="img-fluid rounded mb-3 border border-gray"
                  alt="Post image"
                  style={{
                    height: "100%",
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Posts;

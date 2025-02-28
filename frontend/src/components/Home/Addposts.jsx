import React, { useState, useRef, useEffect } from "react";
import { useHomeStore } from "../../store/home.store";
import { TfiWrite } from "react-icons/tfi";
import { IoArrowRedoOutline } from "react-icons/io5";

const AddPosts = () => {
  const { addPosts } = useHomeStore();
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [isFileInputVisible, setIsFileInputVisible] = useState(false);
  const containerRef = useRef(null);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("text", text);
    if (!file) {
      setFile("");
    }
    formData.append("file", file);

    // Reset the form after submission
    setText("");
    setFile(null);
    setIsFileInputVisible(false);

    if (!text) return;

    // trigger the request post ---
    addPosts(formData);
  };

  const handleClickOutside = (e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      setIsFileInputVisible(false);
    }
  };

  useEffect(() => {
    // Listen for clicks outside the container
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleContainerClick = () => {
    setIsFileInputVisible(true);
  };

  return (
    <div
      className="container hover:bg-primary"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <li className="shadow-sm border rounded btn btn-light w-100">
        <div className="card-body p-2">
          {" "}
          {/* Smaller padding */}
          <h5 className="card-title fs-6 text-success">Create a Post</h5>{" "}
          {/* Smaller font size */}
          <form onSubmit={handleSubmit}>
            {isFileInputVisible && (
              <div className="mb-2">
                {" "}
                {/* Reduced margin-bottom */}
                <textarea
                  className="form-control form-control-sm"
                  rows="2"
                  value={text}
                  onChange={handleTextChange}
                  placeholder="What's on your mind?"
                />
              </div>
            )}

            {isFileInputVisible && (
              <div className="mb-2">
                <input
                  type="file"
                  className="form-control form-control-sm"
                  onChange={handleFileChange}
                />
              </div>
            )}
            {isFileInputVisible && (
              <button type="submit" className="btn btn-sm btn-primary">
                Post
              </button>
            )}
          </form>
        </div>
      </li>
    </div>
  );
};

export default AddPosts;

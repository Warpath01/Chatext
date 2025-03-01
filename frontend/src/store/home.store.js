import { useNavigate } from "react-router-dom";
import { create } from "zustand";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:7000" : "https://chatext-elfm.onrender.com";

export const useHomeStore = create((set) => ({
    posts: [],
    users: [],
    selectedUser: null,

    getUsers: async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/posts/users`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });
            const data = await res.json();
            set({ users: data });
        } catch (error) {
            console.log("Error in getUsers store");
        }
    },
    getPosts: async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/posts/all`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });
            const data = await res.json();
            set({ posts: data });
        } catch (error) {
            console.log("Error in getPosts store");
        }
    },

    addPosts: async (formData) => {
        try {
            const res = await fetch(`${BASE_URL}/api/posts/add`, {
                method: "POST",
                credentials: "include",
                body: formData
            });
            const data = await res.json();
            // set({ posts: data });
        } catch (error) {
            console.log("Error in addPosts store");
        }
    }
}));

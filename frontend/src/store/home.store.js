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
              if (!res.ok) throw new Error("No users!");
            const data = await res.json();
            set({ users: data });
        } catch (error) {
            console.log("No users!");
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
              if (!res.ok) throw new Error("No Posts!");
            const data = await res.json();
            set({ posts: data });
        } catch (error) {
            console.log("No Posts!");
        }
    },

    addPosts: async (formData) => {
        try {
            const res = await fetch(`${BASE_URL}/api/posts/add`, {
                method: "POST",
                credentials: "include",
                body: formData
            });
             if (!res.ok) throw new Error("Error on adding Posts!");
            const data = await res.json();
            // set({ posts: data });
        } catch (error) {
            console.log("Error on adding Posts!");
        }
    }
}));

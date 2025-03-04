import { useNavigate } from "react-router-dom";
import { create } from "zustand";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:7000" : "https://chatext-elfm.onrender.com";

export const useHomeStore = create((set) => ({
    posts: [],
    users: [],
    selectedUser: null,

    getUsers: async () => {
        const token = useAuthStore.getState().accessToken;
        try {
            const res = await fetch(`${BASE_URL}/api/posts/users`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                headers: { "Authorization": `Bearer ${token}` },
            });
            const data = await res.json();
            set({ users: data });
        } catch (error) {
            console.log("Error in getUsers store", error.message)
            set({ users: [] });
            res.status(500).json({ message: "Internal Server Error." })
        }
    },
    getPosts: async () => {
        const token = useAuthStore.getState().accessToken;
        try {
            const res = await fetch(`${BASE_URL}/api/posts/all`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                headers: { "Authorization": `Bearer ${token}` },
            })
            const data = await res.json();
            set({ posts: data });
        } catch (error) {
            console.log("Error in getUsers store", error.message)
            res.status(500).json({ message: "Internal Server Error." })
        }
    },

    addPosts: async (formData) => {
        const token = useAuthStore.getState().accessToken;
        try {
            const res = await fetch(`${BASE_URL}/api/posts/add`, {
                method: "POST",
                credentials: "include",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData
            });
            const data = await res.json();
            // set({ posts: data });
        } catch (error) {
            console.log("Error in addPosts store", error.message);
        }
    },
}))

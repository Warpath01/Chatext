import { create } from "zustand";
import { useAuth } from "../context/AuthContext";
import { useAuthStore } from "./auth.store";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:7000" : "chatext-server-n859tr5cq-warps-projects-5dfd9456.vercel.app";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    selectWorldChat: false,


    getUsers: async () => {
        const token = useAuthStore.getState().accessToken;
        try {
            const res = await fetch(`${BASE_URL}/api/posts/users`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                headers: { "Authorization": `Bearer ${token}` },
                credentials: "include",
            });
            const data = await res.json();
            set({ users: data });
        } catch (error) {
            console.log("Error in getUsers store", error.message)
            res.status(500).json({ message: "Internal Server Error." })
        }
    },

    getPublicMessages: async () => {
        const token = useAuthStore.getState().accessToken;
        try {
            const res = await fetch(`${BASE_URL}/api/messages/all`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                headers: { "Authorization": `Bearer ${token}` },
                credentials: "include",
            })
            const data = await res.json();
            set({ messages: data });
        } catch (error) {
            console.log("Error in getPublicMessages store", error.message)
            res.status(500).json({ message: "Internal Server Error." })
        }
    },


    sendPublicMessages: async (message) => {
        const token = useAuthStore.getState().accessToken;
        try {

            const { messages } = get()

            const res = await fetch(`${BASE_URL}/api/messages/send/all`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                headers: { "Authorization": `Bearer ${token}` },
                body: JSON.stringify(message),
                credentials: "include",
            })
            const data = await res.json();
            set({ messages: [...messages, data] });
        } catch (error) {
            console.log("Error in sendPublicMessages store", error.message)
            res.status(500).json({ message: "Internal Server Error." })
        }
    },



    getPersonalMessage: async (userId) => {
        const token = useAuthStore.getState().accessToken;
        try {
            const res = await fetch(`${BASE_URL}/api/messages/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                headers: { "Authorization": `Bearer ${token}` },
                credentials: "include",
            })
            const data = await res.json();
            set({ messages: data });
        } catch (error) {
            console.log("Error in getPersonalMessage store", error.message)
            res.status(500).json({ message: "Internal Server Error." })
        }
    },

    sendPersonalMessage: async (message) => {
        const token = useAuthStore.getState().accessToken;
        try {
            const { selectedUser, messages } = get()

            const res = await fetch(`${BASE_URL}/api/messages/send/${selectedUser._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                headers: { "Authorization": `Bearer ${token}` },
                body: JSON.stringify(message),
                credentials: "include",
            })
            const data = await res.json();
            set({ messages: [...messages, data] });
        } catch (error) {
            console.log("Error in sendPersonalMessage store", error.message)
            res.status(500).json({ message: "Internal Server Error." })
        }

    },

    // realtime application -------- Personal
    receiveMessage: async () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().getSocket(); // Get the socket instance safely
        if (!socket) return console.warn("Socket is not initialized yet.");

        socket.on("newMessage", (newMessage) => {
            if (newMessage.senderId !== selectedUser._id) return;
            set({ messages: [...get().messages, newMessage] });
        });
    },
    unReceiveMessage: async () => {

        const socket = useAuthStore.getState().getSocket(); // Get the socket instance safely
        if (!socket) return console.warn("Socket is not initialized yet.");
        socket.off("newMessage");
    },


    // realtime applictaion -------- Public
    receivePublicMessages: async () => {
        const { selectWorldChat } = get();
        if (selectWorldChat === true) {
            const socket = useAuthStore.getState().getSocket();
            if (!socket) return console.warn("Socket is not initialized yet.");

            socket.on("newPublicMessage", (newMessage) => {
                set({ messages: [...get().messages, newMessage] });
            });
        }
    },
    unReceivePublicMessages: async () => {

        const socket = useAuthStore.getState().getSocket(); // Get the socket instance safely
        if (!socket) return console.warn("Socket is not initialized yet.");
        socket.off("newPublicMessage");
    },


    setSelectedUser: (selectedUser) => set({ selectedUser }),
    setSelectWorldChat: (selectWorldChat) => set({ selectWorldChat }),
}))

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useChatStore } from "./chat.store";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:7000" : "https://chatext-elfm.onrender.com";

let socketInstance = null;

export const useAuthStore = create(
     persist(
    (set, get) => ({
        myInfo: {},
        onlineContacts: [],
        authUser: null,
        isLoading: false,

        checkAuth: async () => {
            set({ isLoading: true });
            try {
                const res = await fetch(`${BASE_URL}/api/auth/check`, {
                    method: "GET",
                    credentials: "include"
                });
                if (!res.ok) throw new Error("Not logged in");
                const data = await res.json();
                set({ authUser: data });
                get().connectSocket();
            } catch (error) {
                console.log("Not logged in");
                set({ authUser: null });
            } finally {
                set({ isLoading: false });
            }
        },

        connectSocket: () => {
            const { authUser } = get();
            if (!authUser) return; // Ensure user is logged in

            if (!socketInstance) {
                socketInstance = io(BASE_URL, {
                    query: { userId: authUser._id },
                    autoConnect: false, // Ensures manual connection control
                });
            }

            if (!socketInstance.connected) {
                socketInstance.connect();
            }

            socketInstance.on("getOnlineUsers", (userIds) => {
                set({ onlineContacts: userIds });
            });

            socketInstance.on("connect_error", (err) => {
                console.error("WebSocket Connection Error:", err.message);
            });
        },

        disConnectSocket: () => {
            if (socketInstance) {
                socketInstance.disconnect();
            }
        },

        getSocket: () => socketInstance,

        getPersonalInfo: async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/auth/personal`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });
                if (!res.ok) throw new Error("Error in getting personal info!");
                const data = await res.json();
                set({ myInfo: data });
            } catch (error) {
                set({ myInfo: null });
                console.log("Error in getting personal info!");
            } finally {
                set({ isLoading: false });
            }
        },

        updateProfile: async (formData) => {
            try {
                const res = await fetch(`${BASE_URL}/api/auth/update-profile`, {
                    method: "PUT",
                    credentials: "include",
                    body: formData,
                });
                if (!res.ok) throw new Error("Error in Uploading!");
                const data = await res.json();
                return data;
            } catch (error) {
                console.log("Error in Uploading!");
            } finally {
                set({ isLoading: false });
            }
        },

        signup: async (info) => {
            try {
                const res = await fetch(`${BASE_URL}/api/auth/signup`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(info),
                });

                const data = await res.json();
                set({ authUser: data });
                console.log("Signed up successfully!");
                get().connectSocket();
            } catch (error) {
                set({ authUser: null });
            } finally {
                set({ isLoading: false });
            }
        },

        login: async (info) => {

            try {
                const res = await fetch(`${BASE_URL}/api/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(info)
                });

                if (!res.ok) throw new Error("Invalid Credentials!");

                const data = await res.json();
                set({ authUser: data });
                get().connectSocket();
            } catch (error) {
                console.log("Invalid Credentials!");
                set({ authUser: null });
            } finally {
                set({ isLoading: false });
            }
        },

        logout: async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/auth/logout`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });
                if (!res.ok) throw new Error("Error during logout!");
                set({ authUser: null });
                console.log("Logged out successfully!");
                get().disConnectSocket();
            } catch (error) {
                console.log("Error during logout!");
            } finally {
                set({ isLoading: false });
            }
        },

        setIsLoading: (isLoading) => set({ isLoading }),
        setAuthUser: (authUser) => set({ authUser }),
    }),
         {
      name: "auth-storage", // Key for storage
      getStorage: () => sessionStorage, // Use sessionStorage instead of localStorage
    }
  )
);


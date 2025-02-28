import { create } from "zustand"
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { persist } from "zustand/middleware";
import { io } from "socket.io-client";
import { useChatStore } from "./chat.store";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:7000" : "/";

let socketInstance = null;

export const useAuthStore = create(
    persist(
        (set, get) => ({
            authUser: null,
            isAuthenticated: false,
            myInfo: {},
            onlineContacts: [],

            checkAuth: async () => {
                try {
                    const token = localStorage.getItem("jwt");

                    const res = await fetch(`${BASE_URL}/api/auth/check`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            ...(token && { Authorization: `Bearer ${token}` }),
                        },
                        credentials: "include",
                    });

                    if (res.status === 401) {
                        set({ authUser: null, isAuthenticated: false });
                        return;
                    }

                    if (!res.ok) throw new Error("Failed to authenticate");

                    const data = await res.json();
                    set({
                        authUser: data && Object.keys(data).length ? data : null,
                        isAuthenticated: !!data,
                    });

                    // Initialize the socket connection
                    get().connectSocket();
                } catch (error) {
                    set({ authUser: null, isAuthenticated: false });
                    console.log(error.message);
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
                    const data = await res.json();
                    set({ myInfo: data });
                } catch (error) {
                    console.log("Error in updateProfile store", error.message);
                }
            },

            updateProfile: async (formData) => {
                try {
                    const res = await fetch(`${BASE_URL}/api/auth/update-profile`, {
                        method: "PUT",
                        credentials: "include",
                        body: formData
                    });
                    const data = await res.json();
                    return data;
                } catch (error) {
                    console.log("Error in updateProfile store", error.message);
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

                    const data = await res.json()
                    set({ authUser: data });
                    console.log("Signed up successfuly!")
                    get().connectSocket()
                } catch (error) {
                    set({ authUser: null });
                    console.log("Error in signup store", error.message)
                    res.status(500).json({ message: "Internal Server Error." })
                }
            },

            login: async (info) => {
                try {
                    const res = await fetch(`${BASE_URL}/api/auth/login`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                        body: JSON.stringify(info),
                    });

                    const data = await res.json();

                    if (!res.ok) {
                        throw new Error(data.message || "Login failed");
                    }

                    set({ authUser: data, isAuthenticated: true });
                    get().connectSocket()
                } catch (error) {
                    set({ authUser: null, isAuthenticated: false });
                    console.log(error.message);
                }
            },

            logout: async () => {
                try {
                    await fetch(`${BASE_URL}/api/auth/logout`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    });
                    set({ authUser: null, isAuthenticated: false });
                    console.log("Logged out successfuly!")
                    get().disConnectSocket()
                } catch (error) {
                    console.log("Error in logout store", error.message)
                    res.status(500).json({ message: "Internal Server Error." })
                }
            },

        }),
        {
            name: "auth-storage",
            partialize: (state) => Object.fromEntries(
                Object.entries(state).filter(([key]) => key !== "socket") // Exclude socket from persisting
            ),
        }
    )
);



import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useChatStore } from "./chat.store";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:7000" : "https://chatext-elfm.onrender.com";

let socketInstance = null;

export const useAuthStore = create(
    (set, get) => ({
        myInfo: {},
        onlineContacts: [],
        authUser: null,
        isLoading: false,


        fetchWithInterceptor: async (url, options = {}) => {
            set({ isLoading: true });
            try {
                const token = get().authUser?.token;
                const headers = { ...options.headers };
                if (token) {
                    headers["Authorization"] = `Bearer ${token}`;
                }
                const response = await fetch(url, { credentials: "include", headers, ...options });
                if (!response.ok) {
                    console.warn("An error occurred.");
                    throw new Error(`Request failed (${response.status})`);
                }
                return response.json();
            } catch (error) {
                console.log("error fetchWithInterceptor");
            }
        },



        checkAuth: async () => {

            try {
                const data = await get().fetchWithInterceptor(`${BASE_URL}/api/auth/check`, { method: "GET" });
                set({ authUser: data });
                // Initialize the socket connection
                get().connectSocket();
            } catch (error) {
                set({ authUser: null });
                console.log("error checkAuth");
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
                const data = await res.json();
                set({ myInfo: data });
            } catch (error) {
                console.log("Error in getPersonalInfo store");
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
                const data = await res.json();
                return data;
            } catch (error) {
                console.log("Error in updateProfile store");
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
                console.log("Error in signup store");
            } finally {
                set({ isLoading: false });
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
                set({ authUser: data });
                get().connectSocket();
            } catch (error) {
                set({ authUser: null });
                console.log(error.message);
            } finally {
                set({ isLoading: false });
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
                set({ authUser: null });
                console.log("Logged out successfully!");
                get().disConnectSocket();
            } catch (error) {
                console.log("Error in logout store", error.message);
            } finally {
                set({ isLoading: false });
            }
        },

        setIsLoading: (isLoading) => set({ isLoading }),
        setAuthUser: (authUser) => set({ authUser }),
    }),
);

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useChatStore } from "./chat.store";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:7000" : "https://chatext-elfm.onrender.com";

let socketInstance = null;

export const useAuthStore = create((set, get) => ({
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
                console.warn(`Request failed (${response.status}): ${response.statusText}`);
                throw new Error(`Request failed (${response.status})`);
            }

            // Check Content-Type to avoid parsing HTML as JSON
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return response.json();
            } else {
                const text = await response.text();
                console.error("Unexpected response (not JSON):", text);
                throw new Error("Received non-JSON response from server");
            }
        } catch (error) {
            console.error("Fetch error:", error.message);
        } finally {
            set({ isLoading: false });
        }
    },

    checkAuth: async () => {
        set({ isLoading: true });
        try {
            const data = await get().fetchWithInterceptor(`${BASE_URL}/api/auth/check`, { method: "GET" });
            if (data) {
                set({ authUser: data });
                get().connectSocket();
            }
        } catch (error) {
            set({ authUser: null });
            console.error("checkAuth error:", error.message);
        } finally {
            set({ isLoading: false });
        }
    },

    connectSocket: () => {
        const { authUser } = get();
        if (!authUser) return;

        if (!socketInstance) {
            socketInstance = io(BASE_URL, {
                query: { userId: authUser._id },
                autoConnect: false,
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
                    "Authorization": `Bearer ${get().authUser?.token}`,
                },
                credentials: "include",
            });

            const contentType = res.headers.get("content-type");
            if (!res.ok || !contentType.includes("application/json")) {
                const text = await res.text();
                console.error("Unexpected response:", text);
                throw new Error("Failed to fetch personal info");
            }

            const data = await res.json();
            set({ myInfo: data });
        } catch (error) {
            console.error("Error in getPersonalInfo store", error.message);
        } finally {
            set({ isLoading: false });
        }
    },

    updateProfile: async (formData) => {
        try {
            const res = await fetch(`${BASE_URL}/api/auth/update-profile`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Authorization": `Bearer ${get().authUser?.token}`,
                },
                body: formData,
            });

            const contentType = res.headers.get("content-type");
            if (!res.ok || !contentType.includes("application/json")) {
                const text = await res.text();
                console.error("Unexpected response:", text);
                throw new Error("Failed to update profile");
            }

            return res.json();
        } catch (error) {
            console.error("Error in updateProfile store", error.message);
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
            console.error("Error in signup store", error.message);
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
            console.error("Login error:", error.message);
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
                    "Authorization": `Bearer ${get().authUser?.token}`,
                },
                credentials: "include",
            });

            set({ authUser: null });
            console.log("Logged out successfully!");
            get().disConnectSocket();
        } catch (error) {
            console.error("Error in logout store", error.message);
        } finally {
            set({ isLoading: false });
        }
    },

    setIsLoading: (isLoading) => set({ isLoading }),
    setAuthUser: (authUser) => set({ authUser }),
}));

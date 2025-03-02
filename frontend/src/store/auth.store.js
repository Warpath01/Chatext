import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useChatStore } from "./chat.store";

// https://chatext-elfm.onrender.com

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:7000" : "https://chatext-elfm.onrender.com";

let socketInstance = null;

export const useAuthStore = create(
    persist(
        (set, get) => ({
            myInfo: {},
            onlineContacts: [],
            accessToken: null,
            authUser: null,
            isLoading: false,
            // refreshAccessToken: async () => {
            //     try {
            //         const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
            //             method: "POST",
            //             credentials: "include", // Include cookies
            //         });
            //         if (!res.ok) throw new Error("Failed to refresh token");

            //         const data = await res.json();
            //         set({ authToken: data.accessToken }); // Store new token
            //         return data.accessToken;
            //     } catch (error) {
            //         console.log("Refresh token failed");
            //         set({ authUser: null, authToken: null });
            //         return null;
            //     }
            // },

            checkAuth: async () => {
                try {
                    const token = get().accessToken
                    let res = await fetch(`${BASE_URL}/api/auth/check`, {
                        method: "GET",
                        credentials: "include",
                        headers: { "Authorization": `Bearer ${token}` },
                    });

                    // if (res.status === 401) { // Token expired
                    //     token = await refreshAccessToken();
                    //     if (!token) throw new Error("Not logged in");

                    //     res = await fetch(`${BASE_URL}/api/auth/check`, {
                    //         method: "GET",
                    //         credentials: "include",
                    //         headers: { "Authorization": `Bearer ${token}` }
                    //     });
                    // }

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

            // getPersonalInfo: async () => {
            //     try {
            //         const res = await fetch(`${BASE_URL}/api/auth/personal`, {
            //             method: "GET",
            //             headers: {
            //                 "Content-Type": "application/json",
            //             },
            //             credentials: "include",
            //         });
            //         if (!res.ok) throw new Error("Error in getting personal info!");
            //         const data = await res.json();
            //         set({ myInfo: data });
            //     } catch (error) {
            //         set({ myInfo: null });
            //         console.log("Error in getting personal info!");
            //     } finally {
            //         set({ isLoading: false });
            //     }
            // },

            updateProfile: async (formData) => {
                const token = get().accessToken
                try {
                    const res = await fetch(`${BASE_URL}/api/auth/update-profile`, {
                        method: "PUT",
                        credentials: "include",
                        headers: { "Authorization": `Bearer ${token}` },
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
                    await res.json();
                    console.log("Signed up successfully!");
                    get().connectSocket();
                } catch (error) {
                    console.log(error);
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
                        body: JSON.stringify(info),
                    });

                    if (!res.ok) throw new Error("Invalid Credentials!");

                    if(res.ok) {
                         const data = await res.json();
                    const { accessToken, ...myInfo } = data;
                    set({ accessToken, myInfo });
                    get().checkAuth()
                    get().connectSocket();
                    }


                   
                } catch (error) {
                    console.log("Invalid Credentials!", error);
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

                    set({ authUser: null, accessToken: null, myInfo: {}, onlineContacts: [] });
                    // sessionStorage.removeItem("session-user-storage");

                    get().disConnectSocket();

                    console.log("Logged out successfully!");
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
            name: "session-user-storage",
            getStorage: () => sessionStorage, // Uses sessionStorage
        }
    )
);




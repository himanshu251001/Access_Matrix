import React, { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from "../utils/api";

const UserContext = createContext(); //global Holder


// JSX
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await apiFetch("/api/employee/profile");

                if (res && res.ok) {
                    const json = await res.json();
                    setUser(json?.data || json);
                }
            } catch (error) {
                console.error("Failed to fetch user profile", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};


export const useUser = () => useContext(UserContext); // Hook to use the user context data

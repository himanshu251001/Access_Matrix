

import { getAccessToken, setAccessToken } from "../auth";
// import { useNavigate } from "react-router-dom";



const BASE_URL = `http://${import.meta.env.VITE_API_URL || "localhost:3000"}`;

let isRefreshing = false;
let refreshPromise = null;

class Helper {


    static async handleRefresh() {
        if (isRefreshing) {
            return refreshPromise;
        }

        isRefreshing = true;

        refreshPromise = fetch(`${BASE_URL}/auth/refresh`, {
            method: "POST",
            credentials: "include",
        })
            .then(async (res) => {
                if (!res.ok) return null;
                const data = await res.json();
                const token = data.accessToken || null;
                if (token) setAccessToken(token);
                return token;
            })
            .catch((err) => {
                console.error("Token refresh failed:", err);
                return null;
            })
            .finally(() => {
                isRefreshing = false;
                refreshPromise = null;
            });

        return refreshPromise;
    }


    static async getValidToken() {
        const token = getAccessToken();
        if (token) return token;
        return await Helper.handleRefresh();
    }


    static redirectToLogin() {
        setAccessToken(null);
        window.location.href = "/";
        // navigate("/");  To do will create a navigate service in future

    }

    static buildHeaders(token, extraHeaders = {}) {
        return {
            "Content-Type": "application/json",
            ...extraHeaders,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
    }
    static redirectToForbidden() {
        // navigate("/forbidden"); To do will create a navigate service in future
        window.location.href = "/forbidden";
    }

}

export default Helper;
import Helper from "./Helper";

const BASE_URL = `http://${import.meta.env.VITE_API_URL || "localhost:3000"}`;

export async function apiFetch(path, options = {}) {
    const url = `${BASE_URL}${path}`;

    // Get a valid token (from memory or silent refresh)
    let token = await Helper.getValidToken();

    if (!token) {
        Helper.redirectToLogin();
        return;
    }

    try {
        let res = await fetch(url, {
            ...options,
            credentials: "include",
            headers: Helper.buildHeaders(token, options.headers),
        });
        console.log(`API ${options.method || "GET"} ${url} - Status: ${res.status}`,res);

        if (res.status === 401) {
            // Token may have just expired — attempt one refresh
            const newToken = await Helper.handleRefresh();

            if (!newToken) {
                Helper.redirectToLogin();
                return res;
            }

            return fetch(url, {
                ...options,
                credentials: "include",
                headers: Helper.buildHeaders(newToken, options.headers),
            });
        }
        if (res.status === 403) {
            Helper.redirectToForbidden();
        }

        return res;

    } catch (error) {
        console.error("Network error:", error);
        throw error;
    }
}

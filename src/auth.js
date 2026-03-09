let accessToken = null;

export function setAccessToken(token) {
    accessToken = token;
}

export function getAccessToken() {
    return accessToken;
}

/** Clears the in-memory access token (call on logout). */
export function clearAccessToken() {
    accessToken = null;
}

export async function logout() {
    const BASE_URL = `http://${import.meta.env.VITE_API_URL || "localhost:3000"}`;
    clearAccessToken();
    try {
        await fetch(`${BASE_URL}/auth/logout`, {
            method: "POST",
            credentials: "include",
        });
    } catch {
        // TO do raise error which will be handled by the errorMiddleware
    }
    window.location.href = "/";
}

const ACCESS_TOKEN_KEY = "accessToken";

export function setAccessToken(token) {
    if (token) {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
    }
    else{
        localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
}

export function getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);

}

// onLogout
export function clearAccessToken() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
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

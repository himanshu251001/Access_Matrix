import { apiFetch } from "../utils/api";
import { setAccessToken, clearAccessToken } from "../auth";


const handleImpersonate = async (userId, currentUser) => {
    if (userId === currentUser?.id) {
        alert("You cannot impersonate yourself.");
        return;
    }
    try {
        const res = await apiFetch("/auth/impersonate", {
            method: "POST",
            body: JSON.stringify({ targetUserId: userId }),
        });
        if (res && res.ok) {
            const data = await res.json();
            if (data.accessToken) {
                setAccessToken(data.accessToken);
                window.location.reload();
            }
        } else {
            alert("Failed to impersonate user. Ensure you have the right privileges.");
        }
    } catch (err) {
        console.error(err);
        alert("Error impersonating user.");
    }
};

const handleRevert = async () => {
    const res = await apiFetch("/auth/stopImpersonation", {
        method: "POST",
    });
    if (res && res.ok) {
        const data = await res.json();
        setAccessToken(data.accessToken);
        window.location.reload();
    } else {
        alert("Failed to revert impersonation.");
    }
};
const handleLogout = async () => {
    try {
        const res = await apiFetch("/auth/logout", {
            method: "POST",
            credentials: "include",
        });
        if (res && res.ok) {
            clearAccessToken();
        }
    } catch {
        alert("Failed to logout.");
    }
    window.location.href = "/";
}

export { handleImpersonate, handleRevert, handleLogout };
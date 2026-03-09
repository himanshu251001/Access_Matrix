import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Helper from "../utils/Helper";

const ProtectedRoute = () => {
    const [authState, setAuthState] = useState("checking"); 
    
    useEffect(() => {
        Helper.getValidToken().then((token) => {
            setAuthState(token ? "authenticated" : "unauthenticated");
        });
    }, []);
    
    if (authState === "checking") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg" />
            </div>
        );
    }
    
    return authState === "authenticated" ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;

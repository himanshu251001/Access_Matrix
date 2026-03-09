import { Link } from "react-router-dom";

export default function Forbidden() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
            <h1 className="text-6xl font-bold text-yellow-600 mb-4">403</h1>
            <h2 className="text-2xl font-semibold mb-2">Access Forbidden</h2>
            <p className="mb-6 text-base-content/70">You do not have permission to view this page or perform this action.</p>
            <Link to="/dashboard" className="btn btn-primary px-6 py-2 rounded">Go to Dashboard</Link>
        </div>
    );
}



import { Link } from "react-router-dom";

export default function ErrorPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
            <h1 className="text-5xl font-bold text-red-600 mb-4">Oops! Page Not Found</h1>
            <p className="text-lg mb-2">It looks like the page you’re trying to access doesn’t exist<br />or may have been moved.</p>
            <p className="mb-6 text-base-content/70">Please check the URL or go back to the homepage to continue browsing.</p>
            <Link to="/" className="text-blue-600 underline">Go back to Home</Link>
        </div>
    );
}

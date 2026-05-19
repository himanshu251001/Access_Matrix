import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAccessToken } from "../auth";
import { useForm } from "react-hook-form";

function Login() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (formData) => {
    setError("");
    const apiUrl = import.meta.env.VITE_API_URL || "localhost:3000";

    try {
      const res = await fetch(`http://${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json().catch(() => null);
      if (res.ok) {
        let token = data?.accessToken || null;
        if (token) {
          setAccessToken(token);
        }
        reset();
        navigate("/dashboard");
      } else {
        const message = data?.message || "Login failed";
        setError(message);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please try again.");
    }
  };
  return (
    <div className="min-h-screen w-full  flex items-center justify-center p-4 md:p-2 bg-white ">

      <div className="flex flex-col flex-1 md:flex-row rounded-2xl shadow-xl w-[95%] ">

        <div className=" md:flex md:w-1/2 lg:w-2/3 p-5 items-center justify-center ">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            alt="Login"
            className="w-full h-full "
          />
        </div>

        <div className="w-full md:w-1/2 lg:w-1/3 bg-gray-100 flex items-center justify-center p-8 md:p-10">
          <div className="w-full max-w-sm">

            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center p-2">
              Access Matrix
            </h2>
            <p className="text-gray-600 mb-6 font-medium ">
              Sign into your account
            </p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block font-medium text-sm text-gray-900 mb-1"
                >
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter email"
                  autoComplete="email"
                  {...register("email", { required: "Email is required" })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-100 text-gray-800 focus:outline-none focus:ring-2  focus:ring-offset-1 placeholder:text-gray-400 focus:ring-gray-400"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block font-medium text-sm text-gray-900 mb-1"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter password"
                  autoComplete="current-password"
                  {...register("password", { required: "Password is required" })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-100 text-gray-800 focus:outline-none focus:ring-2  focus:ring-offset-1 placeholder:text-gray-400 focus:ring-gray-400"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              {error && (
                <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
              )}

              <button type="submit" className="w-full bg-black text-white py-3 rounded-md shadow-md hover:bg-gray-800 transition">
                LOGIN
              </button>
            </form>

            <div className="text-center mt-6 text-sm text-gray-600">
              <p className="hover:underline cursor-pointer">
                Forgot password?
              </p>
              <p className="mt-2">
                Don't have an account?{" "}
                <span className="text-blue-600 hover:underline cursor-pointer">
                  Register here
                </span>
              </p>
            </div>

            <div className="text-center text-xs text-gray-500 mt-10">
              Terms of use. Privacy policy
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

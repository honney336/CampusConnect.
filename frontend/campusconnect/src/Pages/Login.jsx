import { useState } from "react";
import toast from "react-hot-toast";
import { login } from "../API/API.js";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Both email and password are required");
    }

    setLoading(true);
    try {
      const response = await login({ email, password });

      if (response?.data?.success) {
        const token = response?.data?.token;
        localStorage.setItem("token", token);
        toast.success(response?.data?.message || "Login successful");

        const decoded = jwtDecode(token);
        const { role, email, username, id } = decoded;
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: id,
            username: username,
            name: username,
            role,
            email,
          })
        );
        console.log("Saved user to localStorage:", JSON.parse(localStorage.getItem("user")));

        setTimeout(() => {
          if (role === "admin") navigate("/admindashboard");
          else if (role === "faculty") navigate("/facultydashboard");
          else if (role === "student") navigate("/studentdashboard");
          else navigate("/");
        }, 1000);
      } else {
        toast.error(response?.data?.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mx-auto h-20 w-20  flex items-center justify-center">
            <img
              src="../public/logo.png"
              alt="logo"
              className="h-20 w-20 object-contain"
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access the dashboard
          </p>

          <form className="mt-8 space-y-6" onSubmit={submit}>
            {/* No separate error box, use toast for errors */}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 sm:text-sm transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 sm:text-sm transition-all duration-200"
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>

            {/* No registration link or sign-up option */}

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Use your credentials to access the dashboard
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;

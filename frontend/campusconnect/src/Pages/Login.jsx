// import { useState } from "react";
// import toast from "react-hot-toast";
// import { loginUsers } from "../API/API";
// import jwtDecode from "jwt-decode";

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const submit = async (e) => {
//     if (!email || !password) {
//       return toast.error("Both email and password are required");
//     }

//     try {
//       const data = {
//         email,
//         password,
//       };

//       const response = await loginUsers(data);

//       if (response?.data?.success) {
//         localStorage.setItem("token", response?.data?.token);
//         toast.success(response?.data?.message);
//         const decode = jwtDecode(response?.data?.token);
//         // if (decode?.role === "admin") {
//         //   setTimeout(() => {
//         //     return window.location.href = "/homepage";
            
//         // }, 1000);
// ;
//         return 
//       } 
      
//       else {
//         return toast.error(response?.data?.message || "Login failed");
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       toast.error(error?.response?.data?.message || "Something went wrong");
//     }
//   };

//   return (
//     <div>
//       <form className="mt-10">
//         <input
//           type="text"
//           name="email"
//           value={email}
//           className="border border-amber-30 m-2 p-2"
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="email"
//         />
//         <input
//           type="password"
//           name="password"
//           value={password}
//           className="border border-amber-30 m-2 p-2"
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="password"
//         />
//       </form>

//       <button onClick={submit} className="bg-blue-500 text-white rounded-sm p-3 ml-75">
//         Login
//       </button>
//       <p>Live preview</p>
//       <p>{email}</p>
//       <p>{password}</p>
//     </div>
//   );
// }

// export default Login;



// import React from 'react'

// const Login = () => {
//   return (
//     <div>Login</div>
//   )
// }

// export default Login;


import { useState } from "react";
import toast from "react-hot-toast";
import { login } from "../API/API"; // Assumes this sends POST request to backend
// import jwtDecode from "jwt-decode";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Both email and password are required");
    }

    try {
      const data = { email, password };
      const response = await login(data);
      return toast.success(response?.data?.message || "Login successful");
    }
    catch (error) {
      console.error("Login error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={submit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <label className="block mb-2 text-gray-700">Email</label>
        <input
          type="email"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="block mb-2 text-gray-700">Password</label>
        <input
          type="password"
          className="w-full p-2 mb-6 border border-gray-300 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;

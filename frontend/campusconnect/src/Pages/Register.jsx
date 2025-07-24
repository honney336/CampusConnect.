import { useState } from "react";
import toast from "react-hot-toast";
import { createuser } from "../API/API";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const submit = async (e)=> {
    e.preventDefault();
    if (!name || !email || !password || !role) {
      return toast.error("All fields are required");
    }  
    try {
      const data = { username: name, email, password, role };
      const response = await createuser(data);
      if(response?.data?.success) {
        return toast.success(response?.data?.message);
      } else {
        return toast.error(response?.data?.message || "Failed to register");
      }
    } catch(error) {
      console.error("Error submitting form:", error);
      toast.error(error?.response?.data?.message || "Something went wrong"); 
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">Register</h2>
        <form className="flex flex-col gap-4" onSubmit={submit}>
          <input
            type="text"
            name="name"
            value={name}
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e)=> setName(e.target.value)}
            placeholder="Name"
            autoComplete="off"
          />
          <input
            type="text"
            name="email"
            value={email}
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="off"
          />
          <input
            type="password"
            name="password"
            value={password}
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="off"
          />
          <input
            type="text"
            name="role"
            value={role}
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setRole(e.target.value)}
            placeholder="Role"
            autoComplete="off"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold py-3 transition"
          >
            Register
          </button>
        </form>
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Live Preview</h3>
          <div className="bg-gray-100 rounded-md p-4 text-gray-700">
            <p><span className="font-semibold">Name:</span> {name || <span className="italic text-gray-400">Not entered</span>}</p>
            <p><span className="font-semibold">Email:</span> {email || <span className="italic text-gray-400">Not entered</span>}</p>
            <p><span className="font-semibold">Password:</span> {password ? "••••••••" : <span className="italic text-gray-400">Not entered</span>}</p>
            <p><span className="font-semibold">Role:</span> {role || <span className="italic text-gray-400">Not entered</span>}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
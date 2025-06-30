import React from 'react'
import { Link } from 'react-router';

const Navbar = () => {
//   return (
//     <div className='flex items-center justify-between p-2  bg-gray-200 text-white'>
//         <Link className="bg-blue-500 rounded-4xl pr-4 pl-4 p-2 m-2 text-white" to={"/"}>Homepage</Link>
//         <Link className="bg-blue-500 rounded-4xl pr-4 pl-4 p-2 m-2 text-white" to={"/login"}>Login</Link>
//         <Link className="bg-blue-500 rounded-4xl pr-4 pl-4 p-2 m-2 text-white" to={"/register"}>Register</Link>
//     </div>
//   )
// }
 return (
    <div className="flex items-center justify-between p-4 bg-amber-50 shadow-md">
      <Link className="bg-blue-600 hover:bg-blue-700 rounded-2xl px-4 py-2 text-white" to="/">
        Homepage
      </Link>
      <Link className="bg-blue-600 hover:bg-blue-700 rounded-2xl px-4 py-2 text-white" to="/login">
        Login
      </Link>
      <Link className="bg-blue-600 hover:bg-blue-700 rounded-2xl px-4 py-2 text-white" to="/register">
        Register
        </Link>
      <Link className='bg-blue-600 hover:bg-blue-700 rounded-2xl px-4 py-2 text-white' to="/addproduct">
        Add Product
      </Link>
     
    </div>
  );
};

export default Navbar;

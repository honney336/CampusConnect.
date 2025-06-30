// import React from 'react'

//  const Register = () => {
//   return (
//     <div>Register</div>
//   )
// }

// export default Register;


import { useState } from "react";
import toast from "react-hot-toast";
import { createuser } from "../API/API";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const submit = async (e)=> {
    if
      (!name|| !email || !password || !role) {
        
      return toast.error("All fields are required");

    }  
    
    try{
      // const formData = new FormData();
      // formData.append("username", name);
      // formData.append("email", email);
      // formData.append("password", password );
      const data={
        username:name,email,password,role
      }

      const response= await createuser(data);
      if(response?.data?.success) {
        return toast.success(response?.data?.message);
        
      }

      else{
        return toast.error(response?.data?.message || "Failed to register");
      }


    } catch(error) {
      console.error("Error submitting form:", error);
      toast.error(error?.response?.data?.message || "Something went wrong"); 
    }

  }

  return (
    <div>
      <form className="mt-10" > 
        <input type="text" name="name" value={name} className="border border-amber-30 m-2 p-2"
            onChange={(e)=> setName(e.target.value)} placeholder= "name" />
        <input type="text" name="email" value={email} className="border border-amber-30 m-2 p-2"
            onChange={(e) => setEmail(e.target.value)} placeholder="email" />
        <input type="password" name="password" value={password} className="border border-amber-30 m-2 p-2"
            onChange={(e) => setPassword(e.target.value)} placeholder="password" />
            <input type="text" name="role" value={role} className="border border-amber-30 m-2 p-2"
            onChange={(e) => setRole(e.target.value)} placeholder="role" />
      </form>

      <button onClick={submit} className='bg-green-400 text-white rounded-sm p-3 ml-75'>Submit</button>
      <p>live preview</p>
      <p>{name}</p>
      <p>{email}</p>
      <p>{password}</p>
      <p>{role}</p>
    </div>
  );
}


export default Register;


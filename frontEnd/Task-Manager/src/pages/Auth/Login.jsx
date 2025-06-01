import React,{useContext, useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../components/Inputs/Input'
import { validateEmail } from '../../utilis/helper'
import axiosInstance from '../../utilis/axiosInstance'
import { API_PATHS } from '../../utilis/apiPaths'
import { UserContext } from '../../context/userContext'

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] =useState("")

  const {updateUser} = useContext (UserContext)
  const navigate = useNavigate();

  // handle login from submit
  const handleLogin = async (e) => {
    e.preventDefault();
    if(!validateEmail(email)){
      setError("Please enter a valid email address")
      return;
    }
    if(!password){
      setError("please eneter the password")
      return;
    }
    setError("")
    //login api call 

    try{
       const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN,{
        email,
        password
       });

       const {token,role}= response.data;
       if(token){
        localStorage.setItem("token",token);
        updateUser(response.data);
        // redirect based on role 
        if(role==="admin"){
          navigate("/admin/dashboard");
        }else{
          navigate("/user/dashboard")
        }
       }

    }catch(error){

      if(error.response && error.response.data.message){
        setError(error.response.data.message);
      }else{
        setError("something went wrong .  please try again.")
      }
    }

  }
  return (
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black '>welcome back </h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          please enter your details to log in 
        </p>

        <form onSubmit={handleLogin} action="">
          <Input value={email} onChange={({target})=>setEmail(target.value)} label="Email Address"  type="text" placeholder='faiza@example.com'
          />
          <Input value={password} onChange={({target})=>setPassword(target.value)} label="Password"  type="password" placeholder='min 8 characters'
          />
        {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

        <button type='submit' className='btn-primary'>LOGIN</button>

        <p className='text-[13px] text-slate-800 mt-3' >Don't  have an account?
        <Link className='font-medium text-primary underline ' to='/signUp'>Sign Up</Link>
        </p>
        </form>

      </div>


    </AuthLayout>
  )
}

export default Login
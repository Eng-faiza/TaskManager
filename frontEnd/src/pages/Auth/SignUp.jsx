import React, { useContext } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import Input from '../../components/Inputs/Input';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utilis/axiosInstance';
import { API_PATHS } from '../../utilis/apiPaths';
import { UserContext } from '../../context/userContext';
import uploadImage from '../../utilis/uploadImage';
import { validateEmail } from '../../utilis/helper';

const SignUp = () => {
  const [profilePic, setprofilePic] = React.useState(null);
  const [fullName, setfullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [adminInviteToken, setadminInviteToken] = React.useState("");
  const [error, setError] = React.useState(null);

  
  const {updateUser} = useContext (UserContext)
  const navigate = useNavigate();

  // handle signup from submit
    const handleSignUp = async (e) => {
      e.preventDefault();
      let profileImageUrl =''

      if(!fullName){
        setError("Please enter full name")
        return;
      }
      if(!validateEmail(email)){
        setError("Please enter a valid email address")
        return;
      }
      if(!password){
        setError("please eneter the password")
        return;
      }
      setError("")
      //signup api call 

    try{
      // upload image if present
      if(profilePic) { 
      const imgUploadRes=await uploadImage(profilePic);
      profileImageUrl = imgUploadRes.imageUrl || " ";
      }

       const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER,{
        name:fullName,
        email,
        password,
        profileImageUrl,
        adminInviteToken
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
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
      <h3 className='text-xl font-semibold text-black'>Create an Account</h3>
      <p className='text-xs text-slate-700 mt-[5px] mb-6'>join us today by entering your details below </p>
      
      <form onSubmit={handleSignUp} className='flex flex-col  gap-4'>
        <ProfilePhotoSelector image={profilePic} setImage={setprofilePic} />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 '> 
      <Input 
      value={fullName}
      onChange={({target})=> setfullName(target.value) }
      label="Full Name"
      placeholder='faiza'
      type='text'

      />

       <Input value={email} onChange={({target})=>setEmail(target.value)} label="Email Address"  type="text" placeholder='faiza@example.com'
          />
       <Input value={password} onChange={({target})=>setPassword(target.value)} label="Password"  type="password" placeholder='min 8 characters'
          />
       <Input value={adminInviteToken} onChange={({target})=>setadminInviteToken(target.value)} label="admin Invite Token"  type="text" placeholder='6 Digit Code '
          />

       

        {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

        <button type='submit' className='btn-primary'>SIGN UP</button>

        <p className='text-[13px] text-slate-800 mt-3' >Already   have an account?
        <Link className='font-medium text-primary underline ' to='/login'>Login</Link>
        </p>
 </div>
     
      </form>
      
      </div>
    </AuthLayout>
  )
}

export default SignUp
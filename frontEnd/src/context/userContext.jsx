import React ,{createContext, useState, useEffect,} from "react";
import axiosInstance from "../utilis/axiosInstance";
import { API_PATHS } from "../utilis/apiPaths";


export const UserContext = createContext();

const UserProvider=({children}) =>{
    const [user,setUser]= useState(null);
    const [loading, setLoading ]=useState(true) // new state to track loading

    useEffect(()=>{
        if(user) return ;
        const accessToken =localStorage.getItem("token");

        if(!accessToken) {
            setLoading(false);
            return;
        }
        const fetchUser=async ()=>{
            try{
            const response=await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE)
            setUser(response.data);

            } catch(err){
            console.error("user not authenticated ", err);
            clearUser();

            }
            finally{
                setLoading(false);
            }
        }

        fetchUser();
    },[]);
    const updateUser=(userData)=>{
        setUser(userData);
        localStorage.setItem("token",userData.token);// save token
        setLoading(false);
    }

    const clearUser=()=>{
        setUser(null);
        localStorage.removeItem("token");
    };

    return (
        <UserContext.Provider value={{user,loading,updateUser,clearUser}} >
            {/* // also it was proplem  : c / C */}
        {children}  

        </UserContext.Provider>
    )
}

export default UserProvider;

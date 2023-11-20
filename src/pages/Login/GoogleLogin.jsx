import React from "react";
import { FcGoogle } from "react-icons/fc";

import { auth, provider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";

import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";


function GoogleLogin() {
  const navigate = useNavigate()
    
    const login = async () => {
        try {
            const response = await signInWithPopup(auth, provider)
            const user = {
                "name": response.user.displayName,
                "profile": response.user.photoURL
            }
            Cookies.set("user", JSON.stringify(user), { expires: 2 })
           navigate("/")
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="flex items-center justify-center gap-[10px] cursor-pointer" onClick={login} >
            <FcGoogle size={25} />
            <span className="text-[#385185] font-bold text-[1.2rem]">Log In with Google</span>
        </div>
    )
}

export default GoogleLogin
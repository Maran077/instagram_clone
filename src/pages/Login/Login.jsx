import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

import GoogleLogin from "./GoogleLogin";
import Logo from "../Extra_components/Logo";
import LoadingSpinner from "../Extra_components/LoadingSpinner";

import Cookies from "js-cookie";

function Login() {
  const inputStyle = "block mb-[20px] h-[45px] w-[100%] border-gray-300 border-[2px] pl-2 text-[17px] bg-[#fafafa]"
  const defaultLabelStyle = "absolute text-[20px] p-2"
  const valueLabelStyle = "absolute mt-[2px] ml-[5px] text-[10px]"
  
  const navigate = useNavigate()

  // for give value to signin
  const emailInput = useRef()
  const passwordInput = useRef()

  // for change style of input label
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()

  const [loginError, setLoginerror] = useState("")
  const [loading, setLoading] = useState(false)

  const userLogin = async () => {
    event.preventDefault()
    setLoading(true)
    setLoginerror('')
    const email = emailInput.current.value
    const password = passwordInput.current.value
    try {
      const response = await signInWithEmailAndPassword(auth, email, password)
      const user = {
        "uid": response.user.uid
      }
      Cookies.set("user", JSON.stringify(user), { expires: 2 })
      window.location = "/"
    } catch (error) {

      setLoading(false)
      const msg = error.code.split("/")
      setLoginerror(msg[1])

    }
  }

  useEffect(() => {
    const user = Cookies.get("user")
    if (user) return navigate("/");
    
    return user
  }, [])

  return (
    <div className="flex flex-col justify-center items-center gap-3 h-[100dvh]">

      <main className="w-[400px] scroll-m-0 mx-auto px-[50px] py-[20px] border-gray-300 border-[2px]">
        <Logo size={"big"} extraStyle={"mx-auto mb-3"} />

        <form onSubmit={userLogin} >

          <label htmlFor="userEmail" style={{ transition: '.2s ease-in' }} className={email ? valueLabelStyle : defaultLabelStyle}>Your Email</label>
          <input type="email" id="userEmail" required={true} ref={emailInput} className={inputStyle} onChange={e => setEmail(emailInput.current.value)} />

          <label htmlFor="userPassword" style={{ transition: '.2s ease-in' }} className={password ? valueLabelStyle : defaultLabelStyle}>Password</label>
          <input type="password" required={true} id="userPassword" ref={passwordInput} className={inputStyle} onChange={e => setPassword(passwordInput.current.value)} />

          <button disabled={loading} className="block bg-[#2CB5F9] w-[100%] rounded-lg text-[20px] py-1 font-bold text-white">
            {loading ? <LoadingSpinner spinner={"w-6 h-6"} /> : "Log in"}
          </button>

        </form>
   
        {/* this is for  ------ or -------  */}
        <h1 className="relative text-xl text-center my-3">
          <span className="relative z-10 bg-white px-1">OR</span>
          <span className="absolute top-1/2 left-0 w-[38%] bg-gray-300 h-0.5"></span>
          <span className="absolute top-1/2 right-0 w-[38%]  bg-gray-300 h-0.5"></span>
        </h1>

        <p className="font-bold text-red-700 text-center mb-4">{loginError}</p>
        <GoogleLogin />
      </main>

      <footer className="w-[400px] px-[50px] py-[10px] border-gray-300 border-[2px] text-center">
        <h1> You don't have account <Link to="/signin" className="text-[blue] cursor-pointer">Signin</Link></h1>
      </footer>

    </div>
  )
}

export default Login
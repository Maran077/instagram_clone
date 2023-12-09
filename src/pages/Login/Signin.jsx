import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

import GoogleLogin from "./GoogleLogin";
import Logo from "../Extra_components/Logo";
import LoadingSpinner from "../Extra_components/LoadingSpinner";

import Cookies from "js-cookie";


function Signin() {
  const inputStyle = "block outline-black  mb-[20px] h-[45px] w-[100%] border-gray-300 border-[.7px] pl-2 text-[15px] bg-[#fafafa]"
  const defaultLabelStyle = "transition-all absolute text-[20px] p-2 text-gray-600 "
  const valueLabelStyle = "transition-all absolute mt-[-1px] ml-[5px] text-[12px] "

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrormsg] = useState("")

  // for give value to firebse datebase
  const emailInput = useRef()
  const passwordInput = useRef()
  const passwordInputVerify = useRef()
  const userNameInput = useRef()

  // for change style of input label
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [userName, setUserName] = useState()
  const [passwordVerify, setPasswordVerify] = useState()


  const generateRandomId = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()[]-+=`~,>.</?';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const createUserData = async (response) => {
    const id = generateRandomId(20)
    try {
      const check_id_is_exits = await getDocs(query(collection(db, 'users'), where('id', '==', id)));
      if (!check_id_is_exits.empty) return createUserData;

      await addDoc(collection(db, "users"), {
        name: response.user.displayName,
        profilePic: response.user.photoURL,
        des: "",
        followers: [],
        following: [],
        uid: response.user.uid,
        userId: id
      })

      const user = { "uid": response.user.uid }
      Cookies.set("user", JSON.stringify(user), { expires: 2 })

      setLoading(false)
      navigate("/")
    } catch (error) {
      console.error(error);
      const msg = error.code.split("/")
      setErrormsg(msg[1]||"error")
    }

  }


  const userSignin = async () => {
    event.preventDefault()
    setLoading(true)
    setErrormsg("")

    const userName = userNameInput.current.value.toLowerCase()
    const email = emailInput.current.value
    const password = passwordInput.current.value
    const passwordVerify = passwordInputVerify.current.value

    if (password !== passwordVerify) return (setErrormsg("password are not same"), setLoading(false));

    
    try {
      const check_userName_is_exits = await getDocs(query(collection(db, 'users'), where('name', '==', userName)));
      if (!check_userName_is_exits.empty) return (setErrormsg("userName already used"), setLoading(false));

      const response = await createUserWithEmailAndPassword(auth, email, password, userName)
      await updateProfile(response.user, {
        displayName: userNameInput.current.value,
        photoURL: "https://cdn.pixabay.com/photo/2015/04/18/11/03/profile-728591_1280.jpg",
      })
      createUserData(response)

    } catch (error) {
      console.log(error);
      const msg = error.code.split("/")
      setErrormsg(msg[1]||error.code)
      setLoading(false)
    }

  }

  useEffect(() => {
    const user = Cookies.get("user")
    if (user) return navigate("/");
    return user
  }, [])

  return (
    <div className="flex flex-col justify-center items-center gap-3 h-[100dvh]">

      <div className="w-[400px] px-[50px] py-[10px] border-gray-300 border-[2px]">

        <Logo size={"big"} extraStyle={"mx-auto mb-3"} />
        <h3 className="text-[15px] text-center mb-2 text-gray-700 font-bold">Sign up to see photos and videos from your friends.</h3>
        <GoogleLogin />

        {/* this code is use for  ------ or -------  */}
        <h3 className="relative text-xl text-center my-3">
          <span className="relative z-10 bg-white px-1">OR</span>
          <span className="absolute top-1/2 left-0 w-[38%] bg-gray-300 h-0.5"></span>
          <span className="absolute top-1/2 right-0 w-[38%]  bg-gray-300 h-0.5"></span>
        </h3>

        <form onSubmit={userSignin}>

          <label htmlFor="userName" className={userName ? valueLabelStyle : defaultLabelStyle}>Username</label>
          <input type="text" id="userName" required ref={userNameInput} className={inputStyle} value={userName} onChange={() => setUserName(userNameInput.current.value.toLowerCase())} />

          <label htmlFor="userEmail" className={email ? valueLabelStyle : defaultLabelStyle}>Your Email</label>
          <input type="email" id="userEmail" required ref={emailInput} className={inputStyle} onChange={() => setEmail(emailInput.current.value)} />

          <label htmlFor="userPassword" className={password ? valueLabelStyle : defaultLabelStyle}>Password</label>
          <input type="password" id="userPassword" required ref={passwordInput} className={inputStyle} onChange={() => setPassword(passwordInput.current.value)} />

          <label htmlFor="userPasswordVerify" className={passwordVerify ? valueLabelStyle : defaultLabelStyle}>Password</label>
          <input type="password" id="userPasswordVerify" required ref={passwordInputVerify} className={inputStyle} onChange={() => setPasswordVerify(passwordInputVerify.current.value)} />

          <button disabled={loading} className="block bg-[#2CB5F9] w-[100%] rounded-lg text-[20px] py-1 font-bold text-white mb-2">
            {loading ?
              <LoadingSpinner spinner={"w-8 h-8"} /> :
              "Sign in"
            }
          </button>
        </form>

        <p className="font-bold text-red-700 text-center capitalize">{errorMsg}</p>

      </div>

      <div className="w-[400px] px-[50px] py-[10px] border-gray-300 border-[2px] text-center">
        <h1>Already have account <Link to="/login" className="text-[blue] cursor-pointer">Login</Link></h1>
      </div>

    </div>
  )
}

export default Signin
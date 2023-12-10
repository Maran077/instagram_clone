import React, { createContext, useEffect, useReducer } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import reducer from "./Reducer/Reducer";


import User from "./pages/User/User";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signin from "./pages/Login/Signin";
import LikesPost from "./pages/Likes/LikesPost";
import ErrorPage from "./pages/Error/ErrorPage";

import Cookies from "js-cookie";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: 'login',
    element: <Login />
  },
  {
    path: 'signin',
    element: <Signin />
  },
  {
    path: "userprofile/:userName",
    element: <User />
  },
  {
    path: "likes",
    element: <LikesPost />
  }, {
    path: "*",
    element: <ErrorPage />
  }

])

export const UserContext = createContext()

function App() {

  const getUserData = async () => {
    let user = Cookies.get("user")
    if (!user) return location="/login";
    user = JSON.parse(user)
    console.log(user.uid);
    const q = query(collection(db, "users"), where("uid", "==", user.uid))
    const snapshot = await getDocs(q)
    snapshot.forEach((doc) => {
      dispatch({ type: "set_intialstate_data", intialState: doc.data() })
      // console.log(doc.id, " => ", doc.data());
    });
  }

  useEffect(() => {
    getUserData
    return getUserData
  }, [])

  const [state, dispatch] = useReducer(reducer, {})

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <RouterProvider router={router} />
    </UserContext.Provider>
  )
}


export default App
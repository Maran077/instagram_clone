import React, { createContext, useReducer } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import reducer from "./Reducer/Reducer";
import { initialstate } from "./Reducer/Intialstate";

import User from "./pages/User/User";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signin from "./pages/Login/Signin";
import LikesPost from "./pages/Likes/LikesPost";
import ErrorPage from "./pages/Error/ErrorPage";

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
  },{
    path:"*",
    element:<ErrorPage/>
  }

])

export const UserContext = createContext()

function App() {
  const [state, dispatch] = useReducer(reducer, initialstate)

  return (
    <UserContext.Provider value={{state,dispatch}}>
      <RouterProvider router={router} /> 
    </UserContext.Provider>
  )
}


export default App
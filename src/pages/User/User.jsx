import React, { useContext, useEffect,  useState } from "react";
import { IoMdSettings } from "react-icons/io";
import { useNavigate } from "react-router-dom";

import { db } from "../../firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";

import UserEdit from "./UserEdit";
import Logo from "../Extra_components/Logo";
import Menu from "../Extra_components/Menu";
import PostCard from "../Extra_components/NewPost";
import SettingsMenu from "../Extra_components/SettingMenu";
import LoadingSpinner from "../Extra_components/LoadingSpinner";

import Cookies from "js-cookie";
import { UserContext } from "../../App";

function User() {
    const navigate = useNavigate()

    const { state, dispatch } = useContext(UserContext)

    const [post, setPost] = useState(false)
    const [edit, setEdit] = useState(false)
    const [loading, setLoading] = useState(true)
    const [settings, setSettings] = useState(false)

    const [userPosts, setUserPosts] = useState([])

    const getUserPost = async () => {
        const user = Cookies.get("user")
        if (!user) return navigate("/signin");
        const q = query(collection(db, "posts"), where("userId", "==", state.userId))
        onSnapshot(q, (snapShot) => {
            setUserPosts(snapShot.docs.map(doc => doc.data()))
        })
        setLoading(false)
    }
    useEffect(() => {

        getUserPost
        return (getUserPost)
    }, [])
    return (
        <div >
            <Menu size={37} setPost={setPost} />
            {post && <PostCard setPost={setPost} />}
            {edit && <UserEdit setEdit={setEdit} />}

            {
                loading ?
                    <LoadingSpinner container={"w-[100%] md:w-[90%] lg:w-[85%] h-screen md:ml-auto"} spinner={"w-16 h-16 border-blue-500"} />
                    :

                    <div className="p-5 flex flex-col gap-1 divide-y-2 md:w-[90%] md:ml-auto lg:w-[85%]">
                        <div className="flex justify-between md:hidden  px-4">
                            <Logo size={"small"} />
                            <IoMdSettings size={30} onClick={e => setSettings(setting => !setting)} />
                            {settings && <SettingsMenu />}
                        </div>

                        <div className="flex gap-16 py-3 items-center ">
                            <img src={state.profilePic} className="w-[120px] h-[120px] bg-cover rounded-full" alt="" />
                            <div className="flex flex-col gap-2">

                                <div className="flex gap-6 ">
                                    <h1 className="font-bold text-[1.4rem]">
                                        {state.name}
                                    </h1>
                                    <button className="px-4 hidden bg-[#efefef] rounded md:block" onClick={() => setEdit(true)}>
                                        Edit Profile
                                    </button>
                                </div>

                                <div className="justify-between py-1 hidden md:flex">

                                    <div className="cursor-pointer hover:text-[#e2e2e2] p-2 rounded">
                                        <h1>{userPosts?.length}</h1>
                                        <p>postes</p>
                                    </div>
                                    <div className="cursor-pointer hover:text-[#e2e2e2] p-2 rounded">
                                        <h1>{state.followers?.length}</h1>
                                        <p>followers</p>
                                    </div>
                                    <div className="ccursor-pointer hover:text-[#e2e2e2] p-2 rounded">
                                        <h1>{state.following?.length}</h1>
                                        <p>following</p>
                                    </div>

                                </div>
                                <p>
                                    {state.des}
                                </p>
                                <button className="w-[100%] bg-[#efefef] rounded md:hidden" onClick={() => setEdit(true)}>
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-between md:hidden  px-2">
                            <div className="cursor-pointer hover:border-t-[6px] hover:border-t-[#efefef]  rounded">
                                <h1>{userPosts?.length}</h1>
                                <p>postes</p>
                            </div>
                            <div className="cursor-pointer hover:border-t-[6px] hover:border-t-[#efefef] rounded">
                                <h1>{state.followers?.length}</h1>
                                <p>followers</p>
                            </div>
                            <div className="ccursor-pointer  hover:border-t-[6px] hover:border-t-[#efefef] rounded">
                                <h1>{state.following?.length}</h1>
                                <p>following</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 p-2  ">
                            {
                                userPosts?.map((userPost) =>
                                    <img src={userPost?.postImage} alt="" />
                                )
                            }
                        </div>
                    </div>
            }

        </div>
    )
}

export default User
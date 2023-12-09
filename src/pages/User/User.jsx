import React, { useContext, useEffect,  useState } from "react";
import { IoMdSettings } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";

import { db } from "../../firebase";
import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";

import UserEdit from "./UserEdit";
import Logo from "../Extra_components/Logo";
import Menu from "../Extra_components/Menu";
import PostCard from "../Extra_components/NewPost";
import SettingsMenu from "../Extra_components/SettingMenu";
import LoadingSpinner from "../Extra_components/LoadingSpinner";

import Cookies from "js-cookie";
import { UserContext } from "../../App";

import { Bounce, ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function User() {
    const navigate = useNavigate()
    const {userName}=useParams();

    const { state } = useContext(UserContext)

    const [post, setPost] = useState(false)
    const [edit, setEdit] = useState(false)
    const [loading, setLoading] = useState(true)
    const [settings, setSettings] = useState(false)

    const [userPosts, setUserPosts] = useState([])
    const [userData,setUserData]=useState()

    const notify = (err) => toast.error(err||"error!")

    const getUserPost = async (userId) => {
        try {
            const q = query(collection(db, "posts"), where("userId", "==", userId))
            onSnapshot(q, (snapShot) => {
                setUserPosts(snapShot.docs.map(doc => doc.data()))
            })
            setLoading(false)
            
        } catch (error) {
            // console.log(error);
            setLoading(false)
            notify(error.code||"error!")
        }
    }
    
    const getUserData= async ()=>{

        if (userName===state.name)return (setUserData(state),getUserPost(state.userId));
        try { 
            console.log(userName);           
            const q = query(collection(db, "users"), where("names", "==", userName))
            const snapshot = await getDocs(q)
            for(let doc of snapshot.docs){
                setUserData(doc.data())
                console.log(doc.data())
                getUserPost(doc.data().userId)
            }
        } catch (error) {
            console.log(error); 
            setLoading(false)
            notify(error.code||"error!")

        }
    }

    useEffect(() => {
        const user = Cookies.get("user");
        if (!user) return navigate("/signin");
         
        getUserData
        return getUserData
    }, [userData])
    return (
        <div >
            <Menu size={37} setPost={setPost} />
            <ToastContainer position={"bottom-center"} transition={Bounce} autoClose={1000}/>
            {post && <PostCard setPost={setPost} />}
            {edit && <UserEdit setEdit={setEdit} />}

            {
                loading ?
                    <LoadingSpinner container={"w-[100%] md:w-[90%] lg:w-[85%] h-screen md:ml-auto"} spinner={"w-16 h-16 border-blue-500"} />
                    :

                    <div className="p-5 flex flex-col gap-1 divide-y-2 md:w-[90%] md:ml-auto lg:w-[85%]">
                        <div className="flex justify-between md:hidden  px-4">
                            <Logo size={"small"}  />
                            <IoMdSettings size={30} onClick={() => setSettings(setting => !setting)} />
                            {settings && <SettingsMenu />}
                        </div>

                        <div className="flex gap-16 py-3 items-center ">
                            <img src={userData?.profilePic} className="w-[120px] h-[120px] bg-cover rounded-full" alt="profile" />
                            <div className="flex flex-col gap-2">

                                <div className="flex gap-6 ">
                                    <h1 className="font-bold text-[1.4rem]">
                                        {userData?.name}
                                    </h1>
                                    {userName===state.name&&
                                    <button className="px-4 hidden bg-[#efefef] rounded md:block" onClick={() => setEdit(true)}>
                                        Edit Profile
                                    </button>
                                    }
                                </div>

                                <div className="justify-between py-1 hidden md:flex">

                                    <div className="cursor-pointer hover:text-[#e2e2e2] p-2 rounded">
                                        <h1>{userPosts?.length}</h1>
                                        <p>postes</p>
                                    </div>
                                    <div className="cursor-pointer hover:text-[#e2e2e2] p-2 rounded">
                                        <h1>{userData?.followers?.length}</h1>
                                        <p>followers</p>
                                    </div>
                                    <div className="ccursor-pointer hover:text-[#e2e2e2] p-2 rounded">
                                        <h1>{userData?.following?.length}</h1>
                                        <p>following</p>
                                    </div>

                                </div>
                                <p>
                                    {userData?.des}
                                </p>
                                {userName===undefined&&
                                <button className="w-[100%] bg-[#efefef] rounded md:hidden" onClick={() => setEdit(true)}>
                                    Edit Profile
                                </button>
                                }
                            </div>
                        </div>
                        <div className="flex justify-between md:hidden  px-2">
                            <div className="cursor-pointer hover:border-t-[6px] hover:border-t-[#efefef]  rounded">
                                <h1>{userPosts?.length}</h1>
                                <p>postes</p>
                            </div>
                            <div className="cursor-pointer hover:border-t-[6px] hover:border-t-[#efefef] rounded">
                                <h1>{userData?.followers?.length}</h1>
                                <p>followers</p>
                            </div>
                            <div className="ccursor-pointer  hover:border-t-[6px] hover:border-t-[#efefef] rounded">
                                <h1>{userData?.following?.length}</h1>
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
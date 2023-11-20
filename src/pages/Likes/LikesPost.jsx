import React, { useContext, useEffect,  useRef, useState } from "react";
import { MdCancel } from "react-icons/md";
import { BiSearchAlt2 } from "react-icons/bi";
import { IoMdSettings } from "react-icons/io";
import { useNavigate } from "react-router-dom";

import { db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

import Menu from "../Extra_components/Menu";
import LoadingSpinner from "../Extra_components/LoadingSpinner";
import Logo from "../Extra_components/Logo";
import Card from "../Extra_components/PostCard";
import SettingsMenu from "../Extra_components/SettingMenu";

import Cookies from "js-cookie";
import { UserContext } from "../../App";

function LikesPost() {
    const searchInput = useRef()
    const navigate = useNavigate()

    const { state, dispatch } = useContext(UserContext)

    const [allPosts, setAllPosts] = useState([])

    const [loading, setLoading] = useState(true)
    const [settings, setSettings] = useState(false)
    const [isFocused, setIsFocused] = useState(false)


    const getUserData = async () => {
        const user = Cookies.get("user")
        setAllPosts([])
        if (!user) navigate("/signin");
        try {
            const posts_query = query(collection(db, "posts"), where("likes", "array-contains", state.userId))
            const posts_docs = await getDocs(posts_query)
            let pic;
            let following;
            let name;
            posts_docs.forEach(async (post) => {

                //for add each post to userName and profilePic of who post the post 
                const post_user_query = query(collection(db, "users"), where("userId", "==", post.data().userId))
                const post_user_docs = await getDocs(post_user_query)
                post_user_docs.forEach((user) => {
                    pic = user.data().profilePic
                    name = user.data().name
                    let follwers = [...user.data().followers]
                    following = follwers.includes(state.userId)
                })

                let liked = post.data().likes.includes(state.userId)
                const item = { ...post.data(), "profilePic": pic, "like": liked, "following": following, name }
                setAllPosts(allPosts => [...allPosts, item])

            })
            setLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
    }

    const getOtherUser = async () => {
        const userName = searchInput.current.value;
        setOtherUsersData([])
        try {
            const q = query(collection(db, "users"), where("name", ">=", userName))
            const res = await getDocs(q)
            res.forEach((doc) => {
                setOtherUsersData(item => [...item, doc.data()])
            })
        } catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {
        getUserData
        return getUserData
    }, [])

    return (
        <div>
            <Menu size={37} />
            {loading ? <LoadingSpinner container={"w-[100%] md:w-[90%] lg:w-[85%] h-screen md:ml-auto"} spinner={"w-16 h-16 border-blue-500"} />
                :
                <div className="md:w-[90%] md:ml-auto flex flex-col p-3 gap-4 lg:w-[85%] ">
                    <head className="flex gap-3 pb-2 justify-between items-center border-b-[1px] border-b-gray-400 md:hidden">
                        <Logo size="small" />

                        <div className="bg-[#efefef] flex items-center rounded w-1/2 h-8 gap-2 px-3">
                            <BiSearchAlt2 className={isFocused ? "hidden" : "inline w-[10%] "} color="gray" />
                            <input ref={searchInput} type="text" placeholder="Search" className="outline-none bg-[#efefef] w-[90%] " onChange={getOtherUser} onFocus={e => setIsFocused(true)} onBlur={e => setIsFocused(false)} />
                            <MdCancel size={20} color="gray" className={isFocused ? "inline w-[10%] z-10" : "hidden"} />
                        </div>

                        <IoMdSettings size={30} onClick={e => setSettings(setting => !setting)} />
                        {settings && <SettingsMenu />}
                    </head>

                    <main className="flex flex-col gap-3 items-center divide-y-2">
                        {allPosts.map((post) =>
                            <Card post={post} />
                        )}

                    </main>
                </div>
            }
        </div>
    )
}

export default LikesPost;
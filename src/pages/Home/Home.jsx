import React, { useContext, useEffect, useReducer, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiSearchAlt2 } from "react-icons/bi";
import { MdCancel } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";

import { db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

import Logo from "../Extra_components/Logo";
import Menu from "../Extra_components/Menu";
import Card from "../Extra_components/PostCard";
import Search from "../Extra_components/Search";
import SettingsMenu from "../Extra_components/SettingMenu";
import LoadingSpinner from "../Extra_components/LoadingSpinner";

import Cookies from "js-cookie";
import { UserContext } from "../../App";

function Home() {
    const searchInput = useRef()
    const navigate = useNavigate()
    const { state, dispatch } = useContext(UserContext)
    
    const [allPosts, setAllPosts] = useState([])
    const [otherUsersData, setOtherUsersData] = useState([])

    const [search, setSearch] = useState(false)
    const [loading, setLoading] = useState(true)
    const [settings, setSettings] = useState(false)



    const getUserData = async () => {
        const user = Cookies.get("user")

        setAllPosts([])
        if (!user) return navigate("/signin");
        try {
            const posts_query = query(collection(db, "posts"))
            const posts_docs = await getDocs(posts_query)
            let pic;
            let following;
            let name;
            for (const post of posts_docs.docs) {

                const post_user_query = query(
                    collection(db, "users"),
                    where("userId", "==", post.data().userId)
                );
                const post_user_docs = await getDocs(post_user_query);

                for (const user of post_user_docs.docs) {
                    pic = user.data().profilePic;
                    let followers = [...user.data().followers];
                    following = followers.includes(state.userId);
                    name = user.data().name
                }

                let liked = post.data().likes.includes(state.userId);
                const item = {
                    ...post.data(),
                    "profilePic": pic,
                    "like": liked,
                    following,
                    name
                };

                setAllPosts(allPosts => [...allPosts, item])
            }


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
            const q = query(collection(db, "users"), where("name", "<=", userName))
            const res = await getDocs(q)
            res.forEach((doc) => {
                setOtherUsersData(item => [...item, doc.data()])
            })
        } catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {
        // setLoading(false)

        getUserData
        return getUserData
    },[])

    return (
        <>
            <Menu size={37} search={search} setSearch={search} />

            {loading ? <LoadingSpinner container={"w-[100%] md:w-[90%] lg:w-[85%] h-screen md:ml-auto"} spinner={"w-16 h-16 border-blue-500"} />
                :
                <div className="md:w-[90%] md:ml-auto flex flex-col p-3 gap-4 lg:w-[85%] ">

                    <header className="flex gap-3 pb-2 justify-between items-center border-b-[1px] border-b-gray-400 md:hidden">
                        <Logo size="small" />

                        <div className="bg-[#efefef] flex items-center rounded w-1/2 h-8 gap-2 px-3">
                            <BiSearchAlt2 className={search ? "hidden" : "inline w-[10%] "} color="gray" />
                            <input ref={searchInput} onChange={getOtherUser} onFocus={e => setSearch(true)} onBlur={e => setSearch(false)} type="text" placeholder="Search" className="outline-none bg-[#efefef] w-[90%] " />
                            <MdCancel onClick={() => setSearch(false)} size={20} color="gray" className={search ? "inline w-[10%] z-10" : "hidden"} />
                        </div>
                        {search && <Search otherUsersData={otherUsersData} />}

                        <IoMdSettings size={30} onClick={e => setSettings(setting => !setting)} />
                        {settings && <SettingsMenu />}

                    </header>

                    <main className="flex flex-col gap-3 items-center divide-y-2">
                        {allPosts.map((post) =>
                            <Card post={post} />
                        )}
                    </main>

                </div>
            }
        </>
    )
}

export default Home
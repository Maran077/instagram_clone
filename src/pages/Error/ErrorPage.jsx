import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { BiSearchAlt2 } from "react-icons/bi";
import { MdCancel } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";

import Menu from "../Extra_components/Menu";
import PostCard from "../Extra_components/NewPost";
import Logo from "../Extra_components/Logo";
import Search from "../Extra_components/Search";
import SettingsMenu from "../Extra_components/SettingMenu";

import { Bounce, ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function ErrorPage() {
    const searchInput = useRef()

    const [post, setPost] = useState(false)
    const [search, setSearch] = useState(false)
    const [settings, setSettings] = useState(false)

    const [otherUsersData, setOtherUsersData] = useState([])

    const notify = (err) => toast.error(err||"error!")

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
            // console.log(error);
            notify(error.code||"error!")
        }

    }
    return (
        <>
            <Menu size={37} setPost={setPost} />
            {post && <PostCard setPost={setPost} />}
            <ToastContainer position={"bottom-center"} transition={Bounce} autoClose={1000}/>

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
                <main className="text-center">
                    <h1 className="text-[2rem] font-bold mb-3">Sorry, this page isn't available.</h1>
                    <p className="text-[1rem]">The link you followed may be broken, or the page may have been removed.
                        <Link to={'/'} className="text-blue-500 cursor-pointer">
                            Go back to Instagram.
                        </Link>

                    </p>
                </main>

            </div>
        </>
    )
}

export default ErrorPage;
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BiHomeAlt, BiSearchAlt2 } from "react-icons/bi";
import { AiOutlineHeart, AiOutlineFolderAdd, AiOutlineInstagram } from "react-icons/ai";
import { IoMdSettings } from "react-icons/io";

import Logo from "./Logo";
import SettingsMenu from "./SettingMenu";
import PostCard from "./NewPost";
import Search from "./Search";

import { UserContext } from "../../App";


function Menu({size}) {
    const {state}= useContext(UserContext)

    const [iconSize, setIconsize] = useState(size)

    const [post, setPost] = useState(false)
    const [search,setSearch]=useState(false)
    const [settings, setSettings] = useState(false)
    
    
    const changesize = () => {
        setIconsize(size)
        if (window.innerWidth > 900) setIconsize(40);    
    }

    useEffect(() => {
        window.addEventListener('resize', changesize)
    }, [])
    return (
        <>
         {post && <PostCard setPost={setPost} />}
         {search&&<Search setSearch={setSearch}/>}
        <div className="w-[100%] pt-2 flex justify-around items-center border-t-[1px] border-t-gray-400 bottom-0 fixed bg-white md:left-0 md:flex-col md:pt-[5%] md:w-[8%] md:h-[100%] md:border-t-0 md:justify-start md:gap-9 md:items-start md:pl-5 md:border-r-2 md:border-r-gray-300 lg:w-[15%]" >

            <div className="hidden md:block mb-9">
                <AiOutlineInstagram size={iconSize} className="md:block lg:hidden" />
                <Logo size={"small"} extraStyle={"md:hidden lg:block xl:hidden"} />
                <Logo size={"big"} extraStyle={"hidden xl:block"} />

            </div>

            <Link to={"/"} relative={"path"}  className="flex items-center gap-2 cursor-pointer" >
                <BiHomeAlt size={iconSize} id="home" />
                <label htmlFor="home" className="text-[1.4rem] hidden lg:block"  >Home</label>
            </Link>

            <div className="items-center gap-2 cursor-pointer hidden md:flex" onClick={e=>setSearch(true)}>
                <BiSearchAlt2 size={iconSize} id="search" />
                <label htmlFor="search" className="text-[1.4rem] hidden lg:block" >Search</label>
            </div>
            <Link to={"/likes"} relative={"path"} className="flex items-center gap-2 cursor-pointer">
            
                <AiOutlineHeart size={iconSize} id="likes" />
                <label htmlFor="likes" className="text-[1.4rem] hidden lg:block" >Likes</label>
            </Link>
            <div className="flex items-center gap-2 cursor-pointer" onClick={e => setPost(true)} >
                <AiOutlineFolderAdd size={iconSize} id="post" />
                <label htmlFor="post" className="text-[1.4rem] hidden lg:block" >Post</label>
            </div>
            <div className="hidden md:flex items-center gap-2 cursor-pointer">
                <IoMdSettings size={iconSize} id="settings" onClick={e=>setSettings(setting=>!setting)}/>

                <label htmlFor="settings" className="text-[1.4rem] hidden lg:block" >Settings</label>
              {settings&&  <SettingsMenu/>}
            </div>
            <div className=" cursor-pointer">
                <Link  to={`/userprofile/${state.name}`} className="flex items-center gap-2" relative={"path"}>

                    <img src={state && state.profilePic} id="profile" className="w-[30px] h-[30px]  rounded-full" alt="" />
                    <label htmlFor="profile" className="text-[1.4rem] hidden lg:block" >Profile</label>

                </Link>
            </div>

        </div>
        </>
    )
}
export default Menu
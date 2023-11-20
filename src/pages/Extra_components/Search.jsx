import React, { useRef, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { MdCancel } from "react-icons/md";
import { BiSearchAlt2 } from "react-icons/bi";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";

function Search({ otherUsersData, setSearch }) {

    const input = useRef()
    const [isFocused, setIsFocused] = useState(false)
    const [usersData,setUsersData]=useState(otherUsersData)
    
    const getOtherUser=async()=>{
        const userName=input.current.value;
        console.log(userName);
        setUsersData([])
        try {
            const q = query(collection(db,"users"),where("name",">=",userName))
            const res = await getDocs(q)
            res.forEach((doc)=>{
                setUsersData(item=>[...item,doc.data()])
                console.log(doc.data());
             })
             setIsFocused(true)
         
        } catch (error) {
         console.log(error);
        }
 
     }
    return (
        <div className="fixed w-[100dvw] h-[100dvh]  z-30 flex justify-center items-center ">
            <div className=" w-[80dvw] h-[40dvh] bg-white rounded border-4 z-30 mx-auto mt-[45dvh] md:mt-0 left-[10dvw] md:top-[30dvh] overflow-scroll">
                <div className="bg-[#ffffff] hidden md:flex items-center rounded w-[60%] h-8 gap-2 px-3 ml-[20%]">
                    <BiSearchAlt2 className={isFocused ? "hidden" : "inline w-[10%] "} color="gray" />
                    <input ref={input} type="text" placeholder="Search" className="outline-none bg-[#ffffff] w-[90%] " onFocus={e => setIsFocused(true)} onBlur={e => setIsFocused(false)} onChange={getOtherUser} />
                    <MdCancel onClick={e => setIsFocused(false)} size={20} color="gray" className={isFocused ? "inline w-[10%] z-10" : "hidden"} />
                </div>
                {usersData?.map(user => <User user={user} />)}
            </div>
            <MdCancel className="hidden md:block absolute top-0 right-0 z-50 mt-4 mr-6 " size={40} onClick={e => setSearch(false)} />
            <div className="hidden md:block absolute z-10 w-[100dvw] h-[100dvh] bg-black opacity-5">
            </div>
        </div>
    )
}

export default Search;
function User({ user }) {
    return (
        <div className="flex items-center gap-4 mb-5 ps-6">
            <img src={user.profilePic} alt="" className="w-16 h-16 rounded-full" />
            <p className="font-bold px-2">{user.name}</p>
        </div>
    )
}
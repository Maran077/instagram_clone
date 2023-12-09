import React, { useContext, useState } from "react";
import { MdCancel } from "react-icons/md";



import { collection, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../../firebase";
import LoadingSpinner from "../Extra_components/LoadingSpinner";

import Cookies from "js-cookie";
import { UserContext } from "../../App";

import { Bounce, ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


function UserEdit({ setEdit }) {

    const {state,dispatch}= useContext(UserContext)

    const [name, setName] = useState(state.name)
    const [image, setImage] = useState(state.profilePic)
    const [des, setDes] = useState(state.des)
    const [loading, setLoading] = useState(false)

    const notify = (err) => toast.error(err||"error!")

    const upload = (e) => {
        const type = e.target.files[0].type.split("/")[0]
        console.log(type);
        if (type !== "image") return;
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = function () {
            const base64 = reader.result;
            setImage(base64)
            console.log(base64, image);
        };

        reader.readAsDataURL(file);
    }


    const saveEdit = async () => {
        event.preventDefault()

        setLoading(true)
        let user = Cookies.get("user")

        if (!user) return location = "/signin";
        try {

            dispatch({ type: "change_user_detail", nextName: name, nextProfilePic: image, nextDes: des })
            setLoading(false)
            setEdit(false)

            user = JSON.parse(user)
            const user_query = query(collection(db, "users"), where("uid", "==", user.uid))
            const user_snapshot = await getDocs(user_query)
            const user_ref = user_snapshot.docs[0].ref
            try {
                await updateDoc(user_ref, {
                    name: name,
                    profilePic: image,
                    des: des
                })
            } catch (error) {
                console.log(error);
                notify(error.code||"error!")
            }


        } catch (error) {
            console.log(error);
            notify(error.code||"error!")
        }

    }


    return (
        <div className="fixed w-[100dvw] h-[100dvh]  z-30 flex justify-center items-center ">
            <ToastContainer position={"bottom-center"} transition={Bounce} autoClose={1000}/>
           
            <div className="p-5 flex items-center justify-center h-[100dvh] md:w-[90%] md:ml-auto lg:w-[85%] ">
                <div className="w-[80%] mobile:w-[400px] border-[3px] p-5 rounded bg-white z-40">
                    <h1 className="capitalize  text-[2rem]">edit profile </h1>
                    <form onSubmit={saveEdit}>
                        <div className="flex gap-5 py-3 items-center ">
                            <img src={image} className="w-[60px] h-[60px] bg-cover rounded-full" />
                            <div className="flex flex-col gap-2">
                                <input className="w-[250px] font-bold text-[1.4rem] bg-transparent" value={name} type="text" onChange={e => setName(e.target.value)} />
                                <label htmlFor="profiePic" className="cursor-pointer capitalize text-blue-600 text-[.8rem] font-bold">change profile pic</label>
                                <input type="file" accept="image/*" id="profiePic" className="hidden" onChange={upload} />
                            </div>

                        </div>
                        <div>
                            <label htmlFor="des" className="">
                                Bio
                            </label>
                            <textarea id="des" className="block h-[60px] w-[90%] resize-none mb-3" onChange={e => setDes(e.target.value)} value={des}></textarea>

                        </div>
                        <button type="submit" className=" mt-4 px-4  bg-blue-600 rounded md:block">
                            {
                                loading ?
                                    <LoadingSpinner spinner={"w-4 h-4"} /> :
                                    "Submit"
                            }
                        </button>
                    </form>
                </div>
            </div>
            <MdCancel className="absolute top-0 right-0 z-50 mt-4 mr-6 " size={40} onClick={e => setEdit(false)} />
            <div className="absolute z-10 w-[100dvw] h-[100%] bg-black opacity-5">
            </div>
        </div>


    )
}

export default UserEdit
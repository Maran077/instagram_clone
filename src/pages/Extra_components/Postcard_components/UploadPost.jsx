import React, { useContext, useRef, useState } from "react";

import { db } from "../../../firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

import LoadingSpinner from "../LoadingSpinner";

import { UserContext } from "../../../App";

function UploadPost({ image, setPost }) {
    const des = useRef()
    const { state, dispatch } = useContext(UserContext)
    const [loading, setLoading] = useState(false)

    function generateRandomId(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()[]-+=`~,>.</?';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    const upload = async () => {
        setLoading(true)
        const id = generateRandomId(30)
        try {
            const querySnapshot = await getDocs(query(collection(db, 'posts'), where('postId', '==', id)));

            if (!querySnapshot.empty) return upload;
            try {
                await addDoc(collection(db, "posts"), {
                    postImage: image,
                    des: des.current.value,
                    postId: id,
                    userId: state.userId,
                    likes: []
                })

                setLoading(false)
                setPost(false)

            } catch (error) {
                setLoading(false)
                console.log(error);
            }


        } catch (error) {
            console.log(error);
        }
        console.log(id);

    }

    return (
        <div className="w-[90%] h-[500px] z-30 flex flex-col  items-center bg-white border-[2px] rounded-xl  sm:w-[450px]">
            <div className="border-b-[1px] border-b-gray-400 w-[100%] flex items-center justify-between px-3">
                <h1 className="capitalize text-[1.2rem]  font-bold p-3 ">create new post</h1>
                {loading ? <LoadingSpinner spinner={"w-7 h-7 border-blue-600"} /> :
                    <h1 className="text-[1rem] font-bold text-[#0095f6] cursor-pointer hover:text-[#61aee2]" onClick={upload} >Share</h1>
                }
            </div>
            <div className="flex flex-col justify-center gap-4">
                <img className="w-[100%] h-[70%] bg-cover " src={image} />
                <div className="flex gap-8 items-center px-5">
                    <img className="w-10 h-10 rounded-full" src={state.profilePic} alt="" />
                    <h1>{state.name}</h1>
                </div>
                <textarea ref={des} className="text-[1rem] px-2 pt-1 outline-none resize-none" placeholder="Write Captions here..." autoFocus  ></textarea>
            </div>

        </div>
    )
}

export default UploadPost
import React, { useContext, useEffect, useRef, useState } from "react";
import { MdCancel } from "react-icons/md";

import { db } from "../../firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

import LoadingSpinner from "./LoadingSpinner";
import { UserContext } from "../../App";

import { Bounce, ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


function Comment({ setComment, post }) {
    const commentInput = useRef()
    const {state}= useContext(UserContext)

    const [share, setShare] = useState()
    const [allComments, setAllComment] = useState([])

    const [loading, setLoading] = useState(false)
    const [pageLoading, setpageLoading] = useState(true)

    const notify = (err) => toast.error(err||"error!")


    const postComment = async () => {
        event.preventDefault()
        setLoading(true)
        const comment = commentInput.current.value
        try {
            await addDoc(collection(db, "comments"), {
                comment: comment,
                postId: post.postId,
                userId:state.userId
            })

            setLoading(false)
            setComment(false)
        } catch (error) {
            setLoading(false)
            notify(error.code||"error!")
            // console.log(error);
        }
    }

    const getAllComments = async () => {

        try {
            
            const comments_query = query(collection(db, "comments"), where("postId", "==", post.postId))
            const comments_snapshot = await getDocs(comments_query)
            comments_snapshot.forEach(async(cmt) => {
                const cmt_user_query = query(
                    collection(db, "users"),
                    where("userId", "==", cmt.data().userId)
                );
                const cmt_user_docs = await getDocs(cmt_user_query);
                let name;
                let pic;
                for (const user of cmt_user_docs.docs) {
                   if (user.name===state.name) {
                    name=state.name;
                    pic = state.profilePic;
                   }else{
                    name=user.data().name;
                    pic=user.data().profilePic;
                   }
                }
                const item = {
                    ...cmt.data(),
                    profilePic: pic,
                    name:name
                };
                // console.log(doc.id, " => ", doc.data());
                setAllComment(comments => [...comments, item])
            });
            setpageLoading(false)
        } catch (error) {
            setpageLoading(false)
            notify(error.code||"error!")
            // console.log(error);
        }
    }

    useEffect(() => {
        getAllComments
        return getAllComments
    },[])

    return (
        <div className="fixed top-0 left-0 w-[100dvw] h-[100dvh]  z-30 flex justify-center items-center ">

            <div className="p-5 flex items-center justify-center h-[100dvh] md:w-[90%] md:ml-auto lg:w-[85%] ">
            <ToastContainer position={"bottom-center"} transition={Bounce} autoClose={1000}/>

                {pageLoading ? <LoadingSpinner spinner={"w-16 h-16 border-blue-500"} /> :
                    <form onSubmit={postComment} className="absolute w-[80%] h-[500px] md:w-[700px] border-[3px] p-5 rounded bg-white z-40">
                        <div className="flex-col items-start flex ">
                            <div className="h-[400px] w-[100%] overflow-auto">
                           {allComments.map(cmt =>
                           <div className="flex items-center gap-4 mb-5">
                                <img src={cmt.profilePic} alt="" className="w-16 h-16 rounded-full" />
                                <p><span className="font-bold px-2">{cmt.name}</span> {cmt.comment}</p>
                           </div>
                                )}
                        </div>
                            <div className="absolute bottom-0 mb-5 flex w-[100%] px-5">
                                <input type="text" onChange={e => setShare(e.target.value)} className="outline-none border-0 text-[1.7rem] w-[80%]" maxLength={40} ref={commentInput} placeholder="comment here..." />
                                {
                                    share && loading ? <LoadingSpinner spinner={"w-5 h-5 border-blue-500"} /> : <button className="outline-none border-0 text-blue-600 text-[1.4rem]">Share</button>
                                }
                            </div>
                        </div>
                    </form>
                }
            </div>
            <MdCancel className="absolute top-0 right-0 z-50 mt-4 mr-6 " size={40} onClick={e => setComment(false)} />
            <div className="absolute z-10 w-[100dvw] h-[100%] bg-black opacity-5">
            </div>
        </div>
    )
}

export default Comment;

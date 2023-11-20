import React, { useContext,  useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { LuSend } from "react-icons/lu";

import { db } from "../../firebase";
import { collection, getDocs, query, updateDoc, where } from "firebase/firestore";

import Comment from "./Comment";

import { UserContext } from "../../App";

function Card({ post }) {
  const size = 25
  const {state,dispatch}= useContext(UserContext)

  const [liked, setLiked] = useState(post.like)
  const [likes, setLikes] = useState([...post.likes])
  const [numberOfLikes, setNumberOfLikes] = useState(post.likes.length)

  const [comment, setComment] = useState(false)

  const [following, setFollowing] = useState(post.following)



  const likeThePost = async () => {
    setLiked(liked => !liked)
    let updateLikes = likes
    if (likes.indexOf(state.userId) === -1) {
      setNumberOfLikes(i => i + 1)
      updateLikes.push(state.userId)
      setLikes(likes => [...likes, state.userId])
    } else {
      setNumberOfLikes(i => i - 1)
      updateLikes = updateLikes.filter(item => item !== state.userId)
      setLikes(likes => likes.filter(item => item !== state.userId))
    }
    const q = query(collection(db, "posts"), where("postId", "==", post.postId))
    const snapshot = await getDocs(q)
    snapshot.forEach(async (doc) => {
      try {
        await updateDoc(doc.ref, {
          likes: updateLikes
        })
        console.log('kl');
      } catch (error) {
        console.log(error);
      }
    })
  }

  const follow = async () => {
    setFollowing(following => !following)
  
    const q = query(collection(db, "users"), where("userId", "==", state.userId))
    const snapshot = await getDocs(q)
    snapshot.forEach(async (doc) => {
      let user =[]
      user = doc.data().following
      console.log(user,doc.data(),[doc.data().follwers]);
      if (user.indexOf(post.userId) === -1) {
        user.push(post.userId)
      } else {
        user = user.filter(item => item !== post.userId)    
      }
      // console.log("following",user);
      dispatch({type:"change_user_following_detail",nextFollowing:user})
      try {
        await updateDoc(doc.ref, {
          following: user
        })
        console.log('kl');
      } catch (error) {
        console.log(error);
      }
    })
    const q2 = query(collection(db, "users"), where("userId", "==", post.userId))
    const snapshot2 = await getDocs(q2)
    snapshot2.forEach(async (doc) => {
      let follower =[]
      follower = doc.data().followers
      // console.log(follower,doc.data(),[doc.data().follwers]);
      if (follower.indexOf(state.userId) === -1) {
        follower.push(state.userId)
      } else {
        follower = follower.filter(item => item !== state.userId)    
      }

      try {
        await updateDoc(doc.ref, {
          followers: follower
        })
        console.log('kl');
      } catch (error) {
        console.log(error);
      }
    })


  }


  return (
    <>
      {
        comment && <Comment setComment={setComment} post={post} />
      }
      <div className="pt-3 w-[100%] flex flex-col gap-2 mobile:w-[470px]">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-[46px] h-[46px] rounded-full bg-gradient-to-r from-yellow-500 via-red-500 to-purple-500 flex justify-center items-center ">
              <img src={post.profilePic} className="w-[42px] h-[42px] border-white border-2  rounded-full" alt="" />
            </div>
            <h1 className="text-gray-800">{post.name}</h1>
          </div>
          {
            post.userId === state.userId ? null :
              following ?
              <button className="rounded px-2  text-[1.2rem] text-[#ff3040]" onClick={follow} >Following</button> :
              <button className="rounded px-2 bg-[#ff3040] text-[1.2rem] text-white" onClick={follow}>Follow</button>

          }
        </div>
        <div>
          <img className="w-[100%] bg-cover rounded" src={post.postImage} />
        </div>
        <div className="flex px-2 justify-between">
          <div className="flex gap-2">
            {liked ?
              <AiFillHeart size={size} onClick={likeThePost} color={"red"} /> :
              <AiOutlineHeart size={size} onClick={likeThePost} />
            }
            <FaRegComment size={size} onClick={e => setComment(true)} />
          </div>
          <LuSend size={size} />
        </div>
        <div className="ps-2">
          <p>{numberOfLikes} likes</p>
          <h3><span className="font-bold">{post.user}</span> {post.des}</h3>
          <p className="text-gray-400" onClick={e => setComment(true)}>Comments</p>
        </div>
      </div>
    </>

  )
}
export default Card
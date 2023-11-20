import React, { useState } from "react";
import { MdCancel } from "react-icons/md";

import UploadImage from "./Postcard_components/UploadImage";
import UploadError from "./Postcard_components/UploadError";
import UploadPost from "./Postcard_components/UploadPost";


function PostCard({ setPost }) {
    const [error, setError] = useState(false)
    const [image, setImage] = useState()
   



    const uploadImage = (e) => {
        const type = e.target.files[0].type.split("/")[0]
        console.log(type);
        if (type === "image") {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onload = function () {
                const base64 = reader.result;
                setImage(base64)
                console.log(base64, image);
            };

            reader.readAsDataURL(file);

        } else (
            setError(true)
        )

    }
    return (
        
        <div className="fixed w-[100dvw] h-[100dvh]  z-30 flex justify-center items-center ">
            {error ? (image ? <UploadPost image={image} setPost={setPost}  /> : <UploadError uploadImage={uploadImage} />)
                : (image ? <UploadPost image={image} setPost={setPost}  /> : <UploadImage uploadImage={uploadImage} />)
            } 

            <MdCancel className="absolute top-0 right-0 z-50 mt-4 mr-6 " size={40} onClick={e => setPost(false)} />
            <div className="absolute z-10 w-[100dvw] h-[100%] bg-black opacity-5">
            </div>
        </div>


    )
}

export default PostCard
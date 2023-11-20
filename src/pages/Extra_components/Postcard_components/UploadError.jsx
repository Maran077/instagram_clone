import React from "react";

function UploadError({uploadImage}) {
   
    return (
        <div className="w-[90%] h-[400px] z-30 flex flex-col  items-center bg-white border-[2px] rounded-xl  sm:w-[450px]">
            <h1 className="capitalize text-[1.5rem] text-center font-bold p-3 border-b-[1px] w-[100%] border-b-gray-400">file couldn't be uploaded</h1>
            <div className="flex flex-col justify-center items-center my-auto gap-4">
                <svg fill="red" height="96" role="img" viewBox="0 0 96 96" width="96"><path d="M48 0c26.5 0 48 21.5 48 48S74.5 96 48 96 0 74.5 0 48 21.5 0 48 0zm0 2C22.6 2 2 22.6 2 48s20.6 46 46 46 46-20.6 46-46S73.4 2 48 2zm0 57.8c3.4 0 6.1 2.7 6.1 6.1 0 3.4-2.7 6.1-6.1 6.1s-6.1-2.7-6.1-6.1c0-3.3 2.7-6.1 6.1-6.1zm0 2c-2.3 0-4.1 1.8-4.1 4.1S45.7 70 48 70s4.1-1.8 4.1-4.1c0-2.2-1.8-4.1-4.1-4.1zM48 23c3.5 0 6.4 2.8 6.1 6.2l-1.6 22.5c-.2 2.3-2.2 4-4.5 4-2.4 0-4.4-1.7-4.5-4l-1.6-22.5c-.3-3.4 2.6-6.2 6.1-6.2zm0 2c-2.4 0-4.3 1.9-4.1 4l1.6 22.5c.1 1.2 1.2 2.1 2.5 2.1s2.4-.9 2.5-2.1L52.1 29c.2-2.1-1.7-4-4.1-4z"></path></svg>
                <h1 className="capitalize text-[1.6rem]">file doen't suppert</h1>
                <label htmlFor="file" className="bg-[#0095F6] hover:bg-[#61aee2] cursor-pointer rounded-lg text-white text-[1.3rem] p-4 font-bold">upload photo</label>
                <input type="file" id="file" className="hidden" accept="image/*" multiple={false} onChange={uploadImage} />
            </div>

        </div>
    )
}

export default UploadError
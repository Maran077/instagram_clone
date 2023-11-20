import Cookies from "js-cookie";
import React, { useState } from "react";

function SettingsMenu({ style, closeMenu }) {
    const signOut=()=>{
        Cookies.remove("user");
        location="/login";
    }
    return (
        <div className="absolute mt-[120px] translate-x-[70dvw] md:translate-x-10 w-[160px] h-[80px] bg-white ps-1 py-2 rounded border-2 border-black" >
            <button onClick={signOut} className="block hover:bg-gray-200 hover:text-white font-bold p-1 rounded">Sign Out</button>
            <button onClick={closeMenu} className="block hover:bg-gray-200 hover:text-white font-bold p-1 rounded" >Delete Account</button>
        </div>
    );
}

export default SettingsMenu;
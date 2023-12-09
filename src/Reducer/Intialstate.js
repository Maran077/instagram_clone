import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore"; 

import Cookies from "js-cookie";


export let initialstate

let user = Cookies.get("user")
async function getUserData() {
  
  try {
    if (!user) return alert("please login first");
      user = JSON.parse(user)
      console.log(user.uid);
      const q = query(collection(db, "users"), where("uid", "==", user.uid))
      const snapshot = await getDocs(q)
      snapshot.forEach((doc) => {
        initialstate = doc.data()
        console.log(doc.id, " => ", doc.data());
      });
    
  } catch (error) {
    alert(error.code||"error!")
  }
  
}  
getUserData

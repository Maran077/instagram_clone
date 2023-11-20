import { collection, getDocs, query, where } from "firebase/firestore";
import Cookies from "js-cookie";
import { db } from "../firebase";

export let initialstate

let user = Cookies.get("user")
if (user) {
  user = JSON.parse(user)
  console.log(user.uid);
  const q = query(collection(db, "users"), where("uid", "==", user.uid))
  const snapshot = await getDocs(q)
  snapshot.forEach((doc) => {
    initialstate = doc.data()
    console.log(doc.id, " => ", doc.data());
  });
}









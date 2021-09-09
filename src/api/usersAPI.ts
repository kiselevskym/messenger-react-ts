import {doc, getDoc, getFirestore, setDoc} from "firebase/firestore";

interface userProfileData {
    name: string
}

export {

}

export const fetchUserProfileData = async (id: string) => {
    const docRef = doc(getFirestore(), "users", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        return docSnap.data()
    } else {
        console.log("No such document!");
    }
}

export const addUserProfileData = async (uid: string | undefined, {name}: userProfileData ) => {
    if(uid===undefined) return

    await setDoc(doc(getFirestore(), "users", `${uid}`), {
        name,
    });
}

export const setUserProfileDataObject = ({name}: userProfileData) => {
    return {
        name
    }
}
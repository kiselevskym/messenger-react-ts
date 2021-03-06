import {
    doc,
    getDoc,
    getFirestore,
    setDoc,
    addDoc,
    collection,
    query,
    where,
    getDocs
} from "firebase/firestore";

import {db} from "../firebase/firebase";

import {getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage";


interface userProfileData {
    name: string
}


export const api = {
    fetchUserProfileData: async (id: string) => {
        const docRef = doc(getFirestore(), "users", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            return docSnap.data()
        } else {
            console.log("No such document!");
        }
    },
    addUserProfileData: async (uid: string | undefined, {name}: userProfileData) => {
        if (uid === undefined) return

        await setDoc(doc(getFirestore(), "users", `${uid}`), {
            name: name.trim(),
            uid,
        });
    },
    updateUserProfileData: async (uid: string, data: object & {
        uid: string,
        name: string,
        about: string,
        tag: string
    }) => {
        await setDoc(doc(getFirestore(), "users", `${uid}`), {
            uid: data.uid.trim(),
            name: data.name.trim(),
            about: data.about.trim(),
            tag: data.tag.trim()
        })

    },
    sendMessage: async (sender: string, receiver: string, message: string, username: string) => {
        const refMessages = collection(db, "messages")

        await addDoc(refMessages, {
            sender,
            users: generateId(sender, receiver),
            timestamp: Date.now(),
            text: message
        })

        await setDoc(doc(db, "conversations", generateId(sender, receiver)), {
            users: [sender, receiver],
            timestamp: Date.now(),
            lastText: message,
            lastSender: username
        });

    },

    addUser: async (uid: string) => {
        await setDoc(doc(getFirestore(), "users", `${uid}`), {
            name: "Los Angeles",
            state: "CA",
            country: "USA"
        });
    },
    getUserById: async (uid: string) => {
        const refUser = doc(db, "users", uid)
        const docSnap = await getDoc(refUser)
        return docSnap.data()
    },
    fetchProfileImageByUID: async (uid: string) => {
        const imageRef = ref(getStorage(), `profile/${uid}.jpg`);
        const url = await getDownloadURL(imageRef).then(url => {
            return url
        }).catch(error => {
            return "https://t3.ftcdn.net/jpg/01/09/00/64/360_F_109006426_388PagqielgjFTAMgW59jRaDmPJvSBUL.jpg"
        })
        return url
    },
    uploadProfileImage: (uid: string, file: Blob) => {
        const imageRef = ref(getStorage(), `profile/${uid}.jpg`);
        uploadBytes(imageRef, file, {contentType: file.type})
    },
    fetchUserBy: async (name: string) => {

        const q = query(collection(db, "users"), where("name", "==", name));
        const contacts: any = []
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            contacts.push(doc.data())
        });
        return contacts
    }
}


export const generateId = (id: string, id2: string) => {
    if (id > id2) {
        return id + id2
    } else {
        return id2 + id
    }
}

export default api


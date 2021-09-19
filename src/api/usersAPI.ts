import {
    doc,
    getDoc,
    getFirestore,
    setDoc,
    addDoc,
    collection,
    query,
    where,
    limit,
    orderBy,
    onSnapshot
} from "firebase/firestore";
import {db} from "../firebase/firebase";
import IUserData from "../shared/interfaces/IUserData";

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
            name,
            uid,
        });
    },
    sendMessage: (sender: string, receiver: string, message: string, username: string) => {
        const refMessages = collection(db, "messages")

        addDoc(refMessages, {
            sender,
            users: generateId(sender, receiver),
            timestamp: Date.now(),
            text: message
        })

        setDoc(doc(db, "conversations", generateId(sender, receiver)), {
            users: [sender, receiver],
            timestamp: Date.now(),
            lastText: message,
            lastSender: username
        });

    },
    fetchConversations: async (myId: string) => {
        const refConversations = collection(db, "conversations")
        const q = query(refConversations, where("users", "array-contains-any", [myId]))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const messages: any = [];
            return querySnapshot.forEach((doc) => {
                messages.push(doc.data());
            });
        });
    },
    addUser: async (uid: string) => {
        await setDoc(doc(getFirestore(), "users", `${uid}`), {
            name: "Los Angeles",
            state: "CA",
            country: "USA"
        });
    },
    getUserById: async (uid: string)=> {
        const refUser = doc(db, "users", uid)
        const docSnap = await getDoc(refUser)
        return docSnap.data()
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


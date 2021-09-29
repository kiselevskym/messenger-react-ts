import React, {useEffect} from 'react';
import Sidebar from "./Sidebar/Sidebar";
import MainContent from "./MainContent/MainContent";
import {useDispatch, useSelector} from "react-redux";
import {selectCommunicationWith} from "../../../store/selectors/chatSelectors";
import {
    collection,
    limitToLast,
    onSnapshot,
    orderBy,
    query,
    where,
    endBefore,
    getDocs,
} from "firebase/firestore";
import usersAPI, {generateId} from "../../../api/usersAPI";
import {selectUid} from "../../../store/selectors/authSelectors";
import {db} from "../../../firebase/firebase";
import MessageInterface from "../../../shared/interfaces/MessageInterface";
import MessageItem from "./MessageItem/MessageItem";
import ChatItem from "./ChatItem/ChatItem";
import default_profile_avatar_img from "../../../assets/img/default-user-image.png"
import bookmark_img from "../../../assets/img/bookmark.png"
import ChatInterface from "../../../shared/interfaces/ChatInterface";
import {fetchUserDataById, fetchUserProfileImage} from "../../../store/slices/profileSlice";





const MOBILE_WIDTH = 761

function getWindowDimensions() {
    const {innerWidth: width, innerHeight: height} = window;
    return {
        width,
        height
    };
}

const Home = () => {
    const [windowDimensions, setWindowDimensions] = React.useState(getWindowDimensions());

    const [messages, setMessages] = React.useState<any>([])
    const [chats, setChats] = React.useState([])
    const [isMessagesLoaded, setIsMessagesLoaded] = React.useState(false)
    const [isChatsLoaded, setIsChatsLoaded] = React.useState(false)


    const [lastVisible, setLastVisible] = React.useState<any>(null)
    const [isThereAreMessages, setIsThereAreMessages] = React.useState<any>(null)

    const uid = useSelector(selectUid)
    const communicationWith = useSelector(selectCommunicationWith)


    const messagesRef = collection(db, "messages")
    const dispatch = useDispatch()


    useEffect(()=>{
        uid && dispatch(fetchUserDataById(uid))
        uid && dispatch(fetchUserProfileImage(uid))
    },[uid])

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [])


    const checkIfThereAreMoreMessages = async () => {
        if(!uid || !communicationWith || lastVisible===undefined) return
        const next = query(messagesRef, where("users", "==", generateId(uid, communicationWith)),
            orderBy("timestamp", "asc"),
            endBefore(lastVisible),
            limitToLast(20));
        const response = await getDocs(next)
        setIsThereAreMessages(response.docs[0])
    }

    const loader = async () => {
        if(!uid || !communicationWith) return
        if(!lastVisible) return
        const next = query(messagesRef, where("users", "==", generateId(uid, communicationWith)),
            orderBy("timestamp", "asc"),
            endBefore(lastVisible),
            limitToLast(20));
        const response = await getDocs(next)
        const prevMessages: any = []

        response.docs.forEach((doc)=>{
            const data = doc.data()
            const messageObject: MessageInterface = {
                text: data.text,
                timestamp: data.timestamp,
                users: data.users,
                sender: data.sender
            }
            prevMessages.push(messageObject);
        })
        // @ts-ignore
        setMessages(messages=>[...prevMessages, ...messages])
        setLastVisible(response.docs[0]);
    }

    useEffect(() => {
        if (!uid) return
        setIsChatsLoaded(false)
        const q = query(collection(db, "conversations"), where("users", "array-contains-any", [uid]), orderBy("timestamp", "desc"))

        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            const chats: any = []
            for (let querySnapshotKey of querySnapshot.docs) {
                const data = querySnapshotKey.data()
                const userUID = querySnapshotKey.data().users[0] === uid ? data.users[1] : data.users[0]
                const user = await usersAPI.getUserById(userUID)
                const userPic = await usersAPI.fetchProfileImageByUID(userUID)
                const chatObject: ChatInterface = {
                    lastText: data.lastText,
                    timestamp: data.timestamp,
                    lastSender: data.lastSender,
                    chatUserName: user?.name,
                    chatUID: user?.uid,
                    picture: userPic
                }
                chats.push(chatObject);
            }
            setChats(chats)
            setIsChatsLoaded(true)
        });
        return unsubscribe
    }, [])


    useEffect(() => {
        if (!uid || !communicationWith) return
        setLastVisible(null)
        setIsMessagesLoaded(false)
        const query1 = query(messagesRef,
            where("users", "==", generateId(uid, communicationWith)),
            orderBy("timestamp"),
            limitToLast(20))

        const messages: any = []

        async function fetchMessages() {
            const response = await getDocs(query1)

            response.docs.forEach(doc => {
                const data = doc.data()
                const messageObject: MessageInterface = {
                    text: data.text,
                    timestamp: data.timestamp,
                    users: data.users,
                    sender: data.sender
                }
                messages.push(messageObject);
            })
            if(messages.length>0){
                setMessages(messages)
            }else{
                setMessages([])
            }
            setIsMessagesLoaded(true)
            setLastVisible(response.docs[0]);
        }

        fetchMessages()

    }, [communicationWith])
    const now = Date.now()
    useEffect(()=>{
        if(!uid || !communicationWith) return


        const q = query(messagesRef, where("users", "==", generateId(uid, communicationWith)),
            where("timestamp", ">", Date.now()))



        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            querySnapshot.docChanges().forEach((change) => {

                if (change.type === "added") {
                    const data = change.doc.data()
                    setMessages([...messages, data])
                }
                if (change.type === "modified") {}
                if (change.type === "removed") {}
            });
        });
    return unsubscribe;
    })

    useEffect(()=>{
        checkIfThereAreMoreMessages()
    },[lastVisible])

    const messageItems = messages.map((item: MessageInterface, _:any) => (
        <MessageItem message={item.text} time={item.timestamp} key={_+item.timestamp} my={item.sender === uid}/>
    ))

    const chatItems = chats.map((item: ChatInterface, _) => {
        const username = item.chatUID === uid ? "Избранное" : item.chatUserName

        const pic = item.chatUID === uid ? bookmark_img : (item.picture?item.picture:default_profile_avatar_img)
        return <ChatItem uid={item.chatUID} key={item.timestamp} username={username}
                         lastMessage={item.lastText} time={item.timestamp} picture={pic}
                         lastSender={item.lastSender} />
    })


    const MainContentProps = {
        isMessagesLoaded,
        messages: messageItems,
        func: loader,
        isMoreMessages: isThereAreMessages
    }
    const SidebarProps = {
        isChatsLoaded,
        chats: chatItems
    }

    if (windowDimensions.width < MOBILE_WIDTH) {
        return (
            <div>
                {communicationWith ? <MainContent {...MainContentProps}/> : <Sidebar {...SidebarProps}/>}
            </div>
        )
    }
    return (
        <div className={'full-window'}>
            <Sidebar {...SidebarProps}/>
            <MainContent {...MainContentProps}/>
        </div>
    );
};

export default Home;
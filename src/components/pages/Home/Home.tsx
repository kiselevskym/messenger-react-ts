import React, {useEffect} from 'react';
import Sidebar from "./Sidebar/Sidebar";
import MainContent from "./MainContent/MainContent";
import {useSelector} from "react-redux";
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

    const [messages, setMessages] = React.useState([])
    const [chats, setChats] = React.useState([])
    const [isMessagesLoaded, setIsMessagesLoaded] = React.useState(true)


    const [lastVisible, setLastVisible] = React.useState<any>(null)

    const uid = useSelector(selectUid)
    const communicationWith = useSelector(selectCommunicationWith)

    const messagesRef = collection(db, "messages")


    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [])


    const loader = async () => {
        if(!uid || !communicationWith) return
        if(lastVisible === undefined) return
        const next = query(messagesRef, where("users", "==", generateId(uid, communicationWith)),
            orderBy("timestamp"),
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
        });
        return unsubscribe
    }, [])

    const now = Date.now()
    useEffect(() => {
        if (!uid || !communicationWith) return
        setLastVisible(null)
        setIsMessagesLoaded(false)
        const query1 = query(messagesRef, where("users", "==", generateId(uid, communicationWith)), orderBy("timestamp"), limitToLast(20))

        const messages: any = []

        async function fetchMessages() {
            const response = await getDocs(query1)
            console.log(response.docs)
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
            setMessages(messages)
            setIsMessagesLoaded(true)
            setLastVisible(response.docs[0]);
        }

        fetchMessages()

    }, [communicationWith])

    useEffect(()=>{
        if(!uid || !communicationWith) return

        const q = query(messagesRef, where("users", "==", generateId(uid, communicationWith)),
            where("timestamp", ">", now),
            orderBy("timestamp", "asc"))

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            querySnapshot.docChanges().forEach(async (change) => {
                const data: any = change.doc.data()
                if (change.type === "added") {
                    // @ts-ignore
                    setMessages([...messages, data])
                }
                if (change.type === "modified") {}
                if (change.type === "removed") {}
            });
        });
        return unsubscribe
    })

    const messageItems = messages.map((item: MessageInterface, _) => (
        <MessageItem message={item.text} time={item.timestamp} key={item.timestamp} my={item.sender === uid}/>
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
        isMoreMessages: !!lastVisible
    }
    const SidebarProps = {
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
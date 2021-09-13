import React, {useEffect} from 'react';
import {collection, onSnapshot, orderBy, query, where} from "firebase/firestore";
import {useSelector} from "react-redux";
import {selectCommunicationWith} from "../../../../store/selectors/chatSelectors";
import {selectUid} from "../../../../store/selectors/authSelectors";
import {db} from "../../../../firebase/firebase";
import MessageItem from "../MessageItem/MessageItem";
import IMessage from "../../../../shared/interfaces/IMessage";
import {generateId} from "../../../../api/usersAPI";


const Messages = () => {
    const [messages, setMessages] = React.useState([])
    const communicationWith = useSelector(selectCommunicationWith)
    const uid = useSelector(selectUid)

    const messagesRef = collection(db, "messages")

    useEffect(() => {
        if(uid && communicationWith) {
            const q = query(messagesRef, where("users", "==", generateId(uid, communicationWith)), orderBy("timestamp"))
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const messages: any = [];
                querySnapshot.forEach((doc) => {
                    messages.push(doc.data());
                    console.log("doc.data()")
                    console.log(doc.data())
                });
                setMessages(messages)

            });
            return unsubscribe
        }
    }, [communicationWith])



    const messageItems = messages.map((item: IMessage, _) => {
        return <MessageItem message={item.message} time={item.timestamp} key={item.timestamp} my={item.sender===uid}/>
    })


    return (
        <>
            {messageItems}
        </>
    );
};

export default Messages;
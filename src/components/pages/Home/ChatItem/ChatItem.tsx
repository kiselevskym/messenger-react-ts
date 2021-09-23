import React from 'react';
import s from './chat-item.module.css'
import {useDispatch, useSelector} from "react-redux";
import {setCommunicationWith} from "../../../../store/slices/chatSlice";
import {selectUid} from "../../../../store/selectors/authSelectors";


interface ChatItemProps {
    uid: string
    username: string
    lastMessage: string
    time: any
    picture: string,
    lastSender: string
}

const ChatItem = ({username,lastMessage,time, uid, picture, lastSender}: ChatItemProps) => {
    const myUID = useSelector(selectUid)
    const dispatch = useDispatch()
    const onChatItemClick = () => {
        dispatch(setCommunicationWith(uid))
    }

    const date = () => {
        const dateNow = new Date(Date.now()).toLocaleDateString()
        const dateLastMessage = new Date(time).toLocaleDateString()

        let date
        if(dateNow===dateLastMessage){
            date = new Date(time).toLocaleTimeString()
        }else{
            date = new Date(time).toLocaleDateString()
        }
        return date
    }

    return (
        <div className={s.root} onClick={onChatItemClick}>
            <div className={s.avatar}>
                <img src={picture} alt=""/>
            </div>
            <div className={s.user}>
                <div className={s.userNickname}>
                    {username}
                </div>
                <div className={s.userLastMessage}>{lastSender?lastSender+": ":""} {lastMessage}</div>
            </div>
            <div className={s.userLastMessageTime}>{date()}</div>
        </div>
    );

};

export default ChatItem;
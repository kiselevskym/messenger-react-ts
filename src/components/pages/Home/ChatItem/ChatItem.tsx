import React from 'react';
import s from './chat-item.module.css'
import {useDispatch} from "react-redux";
import {setCommunicationWith} from "../../../../store/slices/chatSlice";


interface ChatItemProps {
    uid: string
    username: string
    lastMessage: string
    time: string
    picture?: string
}


const ChatItem = ({username,lastMessage,time, uid}: ChatItemProps) => {
    const dispatch = useDispatch()
    const onChatItemClick = () => {

        dispatch(setCommunicationWith(uid))
    }
    return (
        <div className={s.root} onClick={onChatItemClick}>
            <div className={s.avatar}>
                <img src="https://cdn.pixabay.com/photo/2019/08/11/18/59/icon-4399701_1280.png" alt=""/>
            </div>
            <div className={s.user}>
                <div className={s.userNickname}>
                    {username}
                </div>
                <div className={s.userLastMessage}>{lastMessage}</div>
            </div>
            <div className={s.userLastMessageTime}>{time}</div>
        </div>
    );
};

export default ChatItem;
import React from 'react';
import s from './chat-item.module.css'


interface ChatItemProps {
    username: string
    lastMessage: string
    time: string
    picture?: string
}

const ChatItem = ({username,lastMessage,time}: ChatItemProps) => {
    return (
        <div className={s.root}>
            <div className={s.avatar}>
                <img src="https://t3.ftcdn.net/jpg/01/09/00/64/360_F_109006426_388PagqielgjFTAMgW59jRaDmPJvSBUL.jpg" alt=""/>
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
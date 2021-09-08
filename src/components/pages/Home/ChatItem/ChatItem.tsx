import React from 'react';
import s from './chat-item.module.css'

const ChatItem = () => {
    return (
        <div className={s.root}>
            <div className={s.avatar}>
                <img src="http://s3.amazonaws.com/37assets/svn/765-default-avatar.png" alt=""/>
            </div>
            <div className={s.username}>
                <div className={s.usernameNickname}>
                    nickname
                </div>
                <div className={s.usernameLastMessage}>last message</div>
            </div>
            <div className={s.timeLastMessage}>11:12pm</div>
        </div>
    );
};

export default ChatItem;
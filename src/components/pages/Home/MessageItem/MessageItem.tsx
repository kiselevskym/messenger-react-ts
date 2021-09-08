import React from 'react';
import s from './message-item.module.css'
import classNames from 'classnames'

interface MessageItemProps{
    message: string
    time?: string
    my?: boolean
}

const MessageItem = ({message, my}: MessageItemProps) => {
    return (
        <div className={s.root}>
            <div className={classNames(s.message, {[s.myMessage]: my})}>
                {message}
            </div>
        </div>
    );
};

export default MessageItem;
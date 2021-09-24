import React from 'react';
import s from './top-information.module.css'
import {GrFormPreviousLink} from "react-icons/gr"
import {useSelector} from "react-redux";
import {selectChatPicture} from "../../../../store/selectors/chatSelectors";


interface TopInformationProps {
    username: string,
    onCloseConversation: any
}


const TopInformation = ({username, onCloseConversation}: TopInformationProps) => {
    const picture = useSelector(selectChatPicture)
    return (
        <div className={s.root}>
            <div className={s.close} onClick={onCloseConversation}>
                <GrFormPreviousLink size={"25"}/>
            </div>
            <div className={s.avatar}>
                <img src={picture} alt="avatar"/>
            </div>
            <div className={s.userInfo}>
                <div className={s.userNickname}>{username}</div>
                {username === "Избранное" ? "": <div className={s.userLastSeen}>last seen</div>}
            </div>
        </div>
    );
};

export default TopInformation;
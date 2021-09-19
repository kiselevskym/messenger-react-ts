import React from 'react';
import s from './top-information.module.css'
import {useDispatch} from "react-redux";
import {setCommunicationWith} from "../../../../store/slices/chatSlice";
import {GrFormPreviousLink} from "react-icons/gr"


interface TopInformationProps {
    uid: string,
    onCloseConversation: any
}

const TopInformation = ({uid, onCloseConversation}: TopInformationProps) => {


    return (
        <div className={s.root}>
            <div className={s.close} onClick={onCloseConversation}>
                <GrFormPreviousLink size={"25"}/>
            </div>
            <div className={s.avatar}>
                <img src="https://t3.ftcdn.net/jpg/01/09/00/64/360_F_109006426_388PagqielgjFTAMgW59jRaDmPJvSBUL.jpg" alt="avatar"/>
            </div>
            <div className={s.userInfo}>
                <div className={s.userNickname}>{uid}</div>
                {uid === "Избранное" ? "": <div className={s.userLastSeen}>last seen</div>}
            </div>
        </div>
    );
};

export default TopInformation;
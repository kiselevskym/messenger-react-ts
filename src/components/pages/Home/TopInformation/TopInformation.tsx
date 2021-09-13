import React from 'react';
import s from './top-information.module.css'

interface TopInformationProps {
    uid: string
}

const TopInformation = ({uid}: TopInformationProps) => {
    return (
        <div className={s.root}>
            <div className={s.avatar}>
                <img src="https://t3.ftcdn.net/jpg/01/09/00/64/360_F_109006426_388PagqielgjFTAMgW59jRaDmPJvSBUL.jpg" alt="avatar"/>
            </div>
            <div className={s.userInfo}>
                <div className={s.userNickname}>{uid}</div>
                <div className={s.userLastSeen}>last seen</div>
            </div>
        </div>
    );
};

export default TopInformation;
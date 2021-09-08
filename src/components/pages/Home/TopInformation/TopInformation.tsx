import React from 'react';
import s from './top-information.module.css'

const TopInformation = () => {
    return (
        <div className={s.root}>
            <div className={s.avatar}>
                <img src="http://s3.amazonaws.com/37assets/svn/765-default-avatar.png" alt="picture"/>
            </div>
            <div className={s.usernameInfo}>
                <div className={s.usernameNickname}>nickname</div>
                <div className={s.usernameLastSeen}>last seen</div>
            </div>
        </div>
    );
};

export default TopInformation;
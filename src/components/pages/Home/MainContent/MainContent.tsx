import React from 'react';
import s from './main-content.module.css'
import TopInformation from "../TopInformation/TopInformation";

const MainContent = () => {
    return (
        <div className={s.root}>
            <TopInformation/>
            Main Content
        </div>
    );
};

export default MainContent;
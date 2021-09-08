import React from 'react';
import Sidebar from "./Sidebar/Sidebar";
import MainContent from "./MainContent/MainContent";


const Home = () => {
    return (
        <div className={'full-window'}>
            <Sidebar/>
            <MainContent/>
        </div>
    );
};

export default Home;
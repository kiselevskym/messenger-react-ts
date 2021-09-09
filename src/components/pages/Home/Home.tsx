import React from 'react';
import Sidebar from "./Sidebar/Sidebar";
import MainContent from "./MainContent/MainContent";
import ModalWindow from "../../ui/ModalWindow/ModalWindow";


const Home = () => {
    return (
        <div className={'full-window'}>
            <ModalWindow>
                <div>test</div>
            </ModalWindow>
            <Sidebar/>
            <MainContent/>
        </div>
    );
};

export default Home;
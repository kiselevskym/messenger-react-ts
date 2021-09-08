import React from 'react';
import {Redirect, useHistory} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectAuthCurrentUser} from "../../../store/selectors/authSelectors";
import {doc, getDoc, getFirestore} from "firebase/firestore";
import Sidebar from "./Sidebar/Sidebar";
import MainContent from "./MainContent/MainContent";


const Home = () => {
    const history = useHistory()
    const currentUser = useSelector(selectAuthCurrentUser)


    return (
        <div className={'full-window'}>
            <Sidebar/>
            <MainContent/>
        </div>
    );
};

export default Home;
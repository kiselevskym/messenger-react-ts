import React from 'react';
import {Redirect, useHistory} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectAuthCurrentUser} from "../../../store/selectors/authSelectors";
import { doc, getDoc, getFirestore } from "firebase/firestore";



const Home = () => {
    const history = useHistory()
    const currentUser = useSelector(selectAuthCurrentUser)




    return (
        <div>
            Home
        </div>
    );
};

export default Home;
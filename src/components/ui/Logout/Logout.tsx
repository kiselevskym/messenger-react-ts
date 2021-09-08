import React from 'react';
import {signOut} from 'firebase/auth'
import firebase from "../../../firebase/firebase";

const Logout = () => {
    const onClickButton = () => {
        signOut(firebase)
    }
    return (
        <button onClick={onClickButton}>
            Sign out
        </button>
    );
};

export default Logout;
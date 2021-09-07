import React from 'react';
import {Switch, Route, useHistory, Redirect} from 'react-router-dom'
import './App.css';
import Login from "./components/pages/Auth/Login/Login";
import Register from "./components/pages/Auth/Register/Register";
import Home from "./components/pages/Home/Home";
import {onAuthStateChanged} from "firebase/auth"
import {signOut} from "firebase/auth"
import auth from "./firebase/firebase";
import {useDispatch, useSelector} from "react-redux";
import {loadingIsEnded, loadingIsStated, setCurrentUser} from "./store/slices/authSlice";
import {selectAuth} from "./store/store";
import UserDetails from "./components/pages/Auth/UserDetails/UserDetails";
import {doc, getDoc, getFirestore} from "firebase/firestore";
import {selectAuthCurrentUser, selectAuthIsLoaded} from "./store/selectors/authSelectors";


function App() {
    const isAuthLoaded = useSelector(selectAuthIsLoaded)
    const history = useHistory()
    const dispatch = useDispatch()
    const currentUser = useSelector(selectAuthCurrentUser)
    React.useEffect(() => {
        dispatch(loadingIsStated())
        onAuthStateChanged(auth, (user) => {
            dispatch(setCurrentUser(user))
            dispatch(loadingIsEnded())
        })
    }, [])


    if (!isAuthLoaded) {
        return (
            <div>
                loading
            </div>
        )
    }

    async function getUser(uid: string|undefined) {
        if(uid===undefined) return
        const docRef = doc(getFirestore(), "users", uid);
        const docSnap = await getDoc(docRef);


        if (!docSnap.exists() && currentUser !== null) {
            history.push('/details')
        }else {
            history.push('/')
        }

    }

    if (currentUser === null) history.push('/login')
    getUser(currentUser?.uid)
    return (
        <div className="window">
            <Switch>
                <Route path={'/login'}>
                    <Login/>
                </Route>
                <Route path={'/register'}>
                    <Register/>
                </Route>
                <Route path={'/'} exact>
                    <Home/>
                </Route>
                <Route path={'/details'}>
                    <UserDetails/>
                </Route>
            </Switch>
            <div onClick={() => signOut(auth)}>{currentUser?.email}</div>
        </div>
    );
}

export default App;

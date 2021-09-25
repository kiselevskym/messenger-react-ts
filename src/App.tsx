import React from 'react';
import {Switch, Route, useHistory} from 'react-router-dom'
import './App.css';
import Login from "./components/pages/Auth/Login/Login";
import Register from "./components/pages/Auth/Register/Register";
import Home from "./components/pages/Home/Home";
import {onAuthStateChanged} from "firebase/auth"
import auth from "./firebase/firebase";
import {useDispatch, useSelector} from "react-redux";
import {loadingIsEnded, loadingIsStated, setCurrentUser} from "./store/slices/authSlice";
import UserDetails from "./components/pages/Auth/UserDetails/UserDetails";
import {doc, getDoc, getFirestore} from "firebase/firestore";
import {selectAuthIsLoaded, selectIsAuth, selectUid} from "./store/selectors/authSelectors";
import Loader from "./components/ui/Loader/Loader";





function App() {
    const history = useHistory()
    const dispatch = useDispatch()



    const isAuthLoaded = useSelector(selectAuthIsLoaded)
    const isUserAuth = useSelector(selectIsAuth)
    const uid = useSelector(selectUid)



    React.useEffect(() => {
        dispatch(loadingIsStated())
        onAuthStateChanged(auth, (user) => {
            dispatch(setCurrentUser(user?.uid))
            dispatch(loadingIsEnded())
        })




    }, [uid, dispatch])




    if (!isAuthLoaded) {
        return (
           <Loader/>
        )
    }


    async function checkUserHasDetails(uid: string) {
        const docRef = doc(getFirestore(), "users", uid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists() && isUserAuth !== null) {
            history.push('/details')
        } else {
            history.push('/')
        }

    }


    if (!isUserAuth) history.push('/login')
    uid && checkUserHasDetails(uid)


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
        </div>
    );
}

export default App;

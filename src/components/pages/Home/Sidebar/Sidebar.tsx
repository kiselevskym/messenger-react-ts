import React, {useEffect} from 'react';
import s from './sidebar.module.css'
import ChatItem from "../ChatItem/ChatItem";
import ModalWindow from "../../../ui/ModalWindow/ModalWindow";
import {getAuth, signOut, updateProfile} from 'firebase/auth'
import firebase, {db} from "../../../../firebase/firebase";
import {useSelector} from "react-redux";
import {selectUid} from "../../../../store/selectors/authSelectors";
import IMessage from "../../../../shared/interfaces/IMessage";
import {collection, onSnapshot, orderBy, query, where} from "firebase/firestore";
import usersAPI, {generateId} from "../../../../api/usersAPI";
import IUserData from "../../../../shared/interfaces/IUserData";


const Sidebar = () => {
    const [showMenu, setShowMenu] = React.useState(false)
    const [showProfile, setShowProfile] = React.useState(false)
    const [chats, setChats] = React.useState([])
    const [isLoaded, setLoaded] = React.useState(false)
    const user = getAuth().currentUser
    const uid = useSelector(selectUid)
    useEffect(() => {
        if (!uid) return

        const chatsRef = collection(db, "conversations")
        const q = query(chatsRef, where("users", "array-contains-any", [uid]))


        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const chats: any = [];
            querySnapshot.forEach((doc) => {
                chats.push(doc.data());

            });
            setChats(chats)

        });

        return unsubscribe
    }, [])


    const onShowMenuClick = () => {
        setShowMenu(true)
    }
    const onShowMyProfileClick = () => {
        setShowMenu(false)
        setShowProfile(true)
    }


    const chatItems = chats.map((item: IMessage | any, _) => {
        const memberId = item.users[0] === uid ? item.users[1] : item.users[0]
        return <ChatItem uid={memberId} key={item.timestamp + _} username={item.username}
                         lastMessage={item.message} time={item.timestamp}/>
    })

    return (
        <>
            <ModalWindow setShow={setShowMenu} show={showMenu}>
                <div className={s.menu}>
                    <ul>
                        <li onClick={onShowMyProfileClick}>Мой профиль</li>
                        <li>Настройки</li>
                        <li onClick={() => signOut(firebase)}>Выйти</li>
                    </ul>
                </div>
            </ModalWindow>
            <ModalWindow setShow={setShowProfile} show={showProfile}>
                <div className={s.profile}>
                    <div className={s.profileInfo}>
                        <div className={s.profileInfoImg}>
                            <img
                                src={user?.photoURL !== null ? user?.photoURL : "https://image.flaticon.com/icons/png/512/147/147144.png"}
                                alt=""/>
                        </div>
                        <div className={s.profileInfoText}>
                            <div className={s.profileInfoName}>username</div>
                            <div className={s.profileInfoLastseen}>last seen today at 11:20</div>
                        </div>
                    </div>
                </div>
            </ModalWindow>
            <div className={s.root}>
                <div className={s.nav}>
                    <div className={s.menuBtn} onClick={onShowMenuClick}>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <input
                        className={s.searchInput} placeholder={"Поиск контактов"}/>
                </div>
                <div>
                    {chatItems}
                </div>

            </div>
        </>
    );
};

export default Sidebar;
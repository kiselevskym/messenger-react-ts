import React from 'react';
import Logout from "../../../ui/Logout/Logout";
import s from './sidebar.module.css'
import ChatItem from "../ChatItem/ChatItem";


const Sidebar = () => {
    const [isContactsSearched, setIsContactsSearched] = React.useState(false)


    const chatItems = new Array(3).fill('_').map(() => {
        return <ChatItem username={"Максим"} lastMessage={"увидимся"} time={"11:27"}/>
    })
    const searchedContactsItems = new Array(1).fill('_').map(() => {
        return <ChatItem username={"Максим"} lastMessage={"Сообщений нет"} time={""}/>
    })


    return (
        <div className={s.root}>
            <input onBlur={() => setIsContactsSearched(false)} onFocus={() => setIsContactsSearched(true)}
                   className={s.searchInput} placeholder={"Поиск контактов"}/>

            {isContactsSearched ? searchedContactsItems : chatItems }
            <Logout/>
        </div>
    );
};

export default Sidebar;
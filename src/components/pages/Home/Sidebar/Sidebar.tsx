import React from 'react';
import Logout from "../../../ui/Logout/Logout";
import s from './sidebar.module.css'
import ChatItem from "../ChatItem/ChatItem";
import SearchInput from "../SearchInput/SearchInput";

const Sidebar = () => {
    return (
        <div className={s.root}>
           <SearchInput/>
            <ChatItem/>
            <ChatItem/>
            <ChatItem/>
            <Logout/>
        </div>
    );
};

export default Sidebar;
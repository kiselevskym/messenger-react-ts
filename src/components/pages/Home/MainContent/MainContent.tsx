import React, {useEffect} from 'react';
import s from './main-content.module.css'
import TopInformation from "../TopInformation/TopInformation";
import InputMessage from "../InputMessage/InputMessage";
import Messages from "../Messages/Messages";
import {useSelector} from "react-redux";
import {selectCommunicationWith} from "../../../../store/selectors/chatSelectors";
import usersAPI from "../../../../api/usersAPI";

const MainContent = () => {
    const communicationWith = useSelector(selectCommunicationWith)
    const [username, setUsername] = React.useState("")
    const [isLoaded, setLoaded] = React.useState(false)



    useEffect(()=>{
        setLoaded(false)
        if(communicationWith) {
            usersAPI.getUserById(communicationWith).then((data: any) => {

                setUsername(data.name)
                setLoaded(true)
            })
        }
    },[communicationWith])

    if (!communicationWith || !isLoaded) {
        return (
            <div className={s.root}>
                select chat
            </div>)
    }

    return (
        <div className={s.root}>
            <TopInformation uid={username}/>
            <div className={s.messagesContainer}>
                <div className={s.chatWidth}>
                    <Messages/>
                </div>
            </div>
            <div className={s.chatWidth}>
                <InputMessage username={username} className={s.root__input}/>
            </div>
        </div>
    );
};

export default MainContent;


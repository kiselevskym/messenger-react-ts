import React, {useEffect} from 'react';
import s from './main-content.module.css'
import TopInformation from "../TopInformation/TopInformation";
import InputMessage from "../InputMessage/InputMessage";
import {useDispatch, useSelector} from "react-redux";
import {selectCommunicationWith} from "../../../../store/selectors/chatSelectors";
import usersAPI from "../../../../api/usersAPI";
import {selectUid} from "../../../../store/selectors/authSelectors";
import Loader from "../../../ui/Loader/Loader";
import {setCommunicationWith} from "../../../../store/slices/chatSlice";

interface MainContentProps {
    messages:  JSX.Element[],
    isMessagesLoaded: boolean,
    func: any,
    isMoreMessages: boolean
}


const MainContent = ({messages, isMessagesLoaded, func, isMoreMessages}: MainContentProps) => {
    const communicationWith = useSelector(selectCommunicationWith)
    const [username, setUsername] = React.useState("")
    const [isLoaded, setLoaded] = React.useState(false)
    const uid = useSelector(selectUid)

    const ref = React.useRef<HTMLDivElement>(null);
    const dispatch = useDispatch()


    useEffect(() => {
        if (communicationWith) {
            setLoaded(false)
            if (communicationWith === uid) {
                setUsername("Избранное")
                setLoaded(true)
            } else {
                usersAPI.getUserById(communicationWith).then((data: any) => {
                    setUsername(data.name)
                    setLoaded(true)
                })
            }
        }
    }, [communicationWith])

    useEffect(()=>{
        ref.current && ref.current.scrollTo(50,ref.current.scrollHeight)
    })



    const onCloseConversation = () => {
        setLoaded(false)
        dispatch(setCommunicationWith(undefined))
    }

    if (!communicationWith) {
        return (
            <div className={s.root}>
                <div className={s.selectChat}>
                    <span>Выберете, кому бы хотели написать</span>
                </div>
            </div>)
    }
    if(!isLoaded || !isMessagesLoaded){
        return(<div className={s.root}>
            <Loader/>
        </div>)
    }

    return (
        <div className={s.root} id={"main"}>
            <TopInformation uid={username} onCloseConversation={onCloseConversation}/>
            <div className={s.messagesContainer} ref={ref}>
                {isMoreMessages?<div className={s.btnLoadMore} onClick={func}>Показать еще</div>:""}
                <div className={s.chatWidth}>
                    {messages}
                </div>
            </div>
            <div className={s.chatWidth}>
                <InputMessage username={username} className={""}/>
            </div>
        </div>
    );
};

export default MainContent;


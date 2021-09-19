import React from 'react';
import classNames from "classnames";
import s from "./input-messages.module.css"
import usersAPI from "../../../../api/usersAPI";
import {useSelector} from "react-redux";
import {selectCommunicationWith} from "../../../../store/selectors/chatSelectors";
import {selectUid} from "../../../../store/selectors/authSelectors";


interface InputMessageProps {
    className?: string
    username: string
}

const InputMessage = ({className, username}: InputMessageProps) => {

    const communicationWith = useSelector(selectCommunicationWith)
    const uid = useSelector(selectUid)
    const [message, setMessage] = React.useState("")
    const [usernamet, setUsername] =React.useState("")
    React.useEffect(()=>{
        if(!uid) return
        const unsubscribe = usersAPI.getUserById(uid).then((data: any)=>{
            setUsername(data.name)
        })
        return ()=>setMessage("");
    },[])


    const onPressEnter = (e: any) => {

        if (e.code === "Enter") {
            if (uid !== undefined && communicationWith !== undefined) {
                usersAPI.sendMessage(uid, communicationWith, message, usernamet)
                setMessage("")

            }
        }
    }

    const onChangeMessage = (e: any) => {
        setMessage(e.target.value)
    }

    return (
        <input value={message} className={classNames([s.root], className)} type="text" placeholder={"Пишите..."}
               onChange={(e) => onChangeMessage(e)} onKeyDown={(e) => onPressEnter(e)}/>
    );
};

export default InputMessage;
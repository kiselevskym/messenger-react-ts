import React, {ChangeEvent, useEffect} from 'react';
import s from './sidebar.module.css'
import {collection, query, where, getDocs} from "firebase/firestore";
import {db} from "../../../../firebase/firebase";
import {getAuth, signOut} from "firebase/auth"
import ChatItem from "../ChatItem/ChatItem";
import {useTransition, animated, config} from "react-spring";
import {RiBookmarkFill} from 'react-icons/ri'
import {setCommunicationWith} from "../../../../store/slices/chatSlice";
import {useDispatch, useSelector} from "react-redux";
import {selectUid} from "../../../../store/selectors/authSelectors";
import ChatItemLoader from "../ChatItem/ChatItemLoader";
import {selectProfileState} from "../../../../store/selectors/profileSelectors";
import {GrFormPreviousLink} from "react-icons/gr";
import Input from "../../Auth/Input/Input";
import {useForm} from "react-hook-form";
import {AuthInput} from "../../../../shared/interfaces/AuthInput";
import UserDataInput from "../../../../shared/interfaces/UserDataInput";
import {ImageUpload} from "../../../ui/ImageUpload/ImageUpload";

interface SidebarProps {
    chats: JSX.Element[]
}

const Sidebar = ({chats}: SidebarProps) => {
    const [showMenu, setShowMenu] = React.useState(false);
    const [lookingForContacts, setLookingForContacts] = React.useState(false);
    const [input, setInput] = React.useState("")
    const [contacts, setContacts] = React.useState([])
    const [renderComponentName, setRenderComponentName] = React.useState<"default" | "settings">("default")

    const uid = useSelector(selectUid)
    const profile = useSelector(selectProfileState)
    const dispatch = useDispatch()


    const transition = useTransition(showMenu, {
        from: {x: -300},
        enter: {x: 0},
        leave: {x: -300},
        reverse: !showMenu,
        delay: 0,
        config: {duration: 150}
    })

    async function fetchUsers() {
        const q = query(collection(db, "users"), where("name", "==", input));

        const contacts: any = []
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            contacts.push(doc.data())
        });
        setContacts(contacts)
    }

    React.useEffect(() => {
        if (input.length > 2) {
            fetchUsers()
        }


        if (input.length > 0) {
            setLookingForContacts(true)
        } else {
            setLookingForContacts(false)
        }
    }, [input])

    useEffect(() => {

    }, [])
    const contactsItems = contacts.map((item: any, _) => (
        <ChatItem uid={item.uid} username={item.name} lastMessage={"Тут ничего нет"} time={""} lastSender={""}
                  picture={"https://t3.ftcdn.net/jpg/01/09/00/64/360_F_109006426_388PagqielgjFTAMgW59jRaDmPJvSBUL.jpg"}/>
    ))

    const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value)
    }
    const onClickShowMenu = () => {
        setShowMenu(true)
    }
    const onBookmarkClick = () => {
        dispatch(setCommunicationWith(uid))
        setShowMenu(false)
    }
    const onSignOutClick = () => {
        signOut(getAuth())
    }
    const onClickCloseMenu = (e: any) => {
        if (e.target.className === s.menu) {
            setShowMenu(false)
        }
    }

    const onSettingsClick = () => {
        setShowMenu(false)
        setRenderComponentName("settings")
    }

    const onTEST = () => {
        setRenderComponentName("default")
    }


    const { register, handleSubmit, watch, formState: { errors } } = useForm<UserDataInput>();
    const onSubmit = (data: any) => console.log(data);

    let render
    if (renderComponentName === "settings") {
        render = (
            <>
                <div className={s.settingsTop}>
                    <div className={s.settingsTopPrev} onClick={onTEST}>
                        <GrFormPreviousLink size={"30"}/>
                    </div>
                    <div className={s.settingsTopText}>
                        Настройки
                    </div>
                </div>

                <div className={s.settingsMain}>
                    <ImageUpload />
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Input type={'name'} className={s.root__input} placeholder={"Введите свой пароль"} label={"name"}
                               register={register}/>
                        <Input type={'password'} className={s.root__input} placeholder={"Введите свой пароль"} label={"bio"}
                               register={register}/>
                        <Input type={'password'} className={s.root__input} placeholder={"Введите свой пароль"} label={"tag"}
                               register={register}/>

                        <input type="submit" />
                    </form>
                </div>


            </>)
    } else if (renderComponentName === "default") {
        render = (
            <>
                <nav role="navigation" className={s.nav}>
                    <div className={s.menuButton} onClick={onClickShowMenu}>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <input value={input} onChange={onChangeInput} placeholder={"Поиск"} className={s.input}/>
                </nav>
                <div className={s.chats}>
                    {!lookingForContacts ? chats.length ? chats : new Array(8).fill("_").map((item, id) =>
                        <ChatItemLoader key={id}/>) : contactsItems}

                </div>
            </>
        )
    }


    return (
        <>
            {transition((style, item) => (
                item && <div className={s.menu} onClick={(e) => onClickCloseMenu(e)}>
                    <animated.ul style={style}>
                        <div className={s.profile}>
                            <div className={s.profileImg}>
                                <img
                                    src="https://t3.ftcdn.net/jpg/01/09/00/64/360_F_109006426_388PagqielgjFTAMgW59jRaDmPJvSBUL.jpg"
                                    alt=""/>
                            </div>
                            <div className={s.profileUser}>
                                <div className={s.profileBookmark} onClick={onBookmarkClick}><RiBookmarkFill
                                    color={'#FFFFFF'} size={'24'}/></div>
                                <div className={s.profileName}>{profile.data.name}</div>
                                <div className={s.profileEmail}>{getAuth().currentUser?.email}</div>
                            </div>
                        </div>
                        <li onClick={onSettingsClick}>Настройки</li>
                        <li onClick={onSignOutClick}>Выйти</li>
                    </animated.ul>
                </div>
            ))}
            <div className={s.root} id={"sidebar"}>
                {render}
            </div>
        </>
    );

};

export default Sidebar;
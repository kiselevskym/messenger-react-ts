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
import UserDataInput from "../../../../shared/interfaces/UserDataInput";
import {ImageUpload} from "../../../ui/ImageUpload/ImageUpload";
import Button from "../../../ui/Button/Button";

interface SidebarProps {
    chats: JSX.Element[]
}

const Sidebar = ({chats}: SidebarProps) => {
    const [showMenu, setShowMenu] = React.useState(false);
    const [lookingForContacts, setLookingForContacts] = React.useState(false);
    const [input, setInput] = React.useState("")
    const [contacts, setContacts] = React.useState([])
    const [renderComponentName, setRenderComponentName] = React.useState<"default" | "settings">("default")
    const [isBtnDisabled, setIsBtnDisabled] = React.useState(true)

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


    const {register, handleSubmit, watch, setValue , formState: {errors}} = useForm<UserDataInput>();
    const watchAllFields = watch();
    const onSubmit = (data: any) => console.log(data);
    useEffect(() => {
        setValue("name", profile.data.name)
        setValue("bio", profile.data.about?profile.data.about:"")
        setValue("tag", profile.data.tag?profile.data.tag:"")

    }, [profile.data])

    useEffect(() => {
        if(watchAllFields.name !== profile.data.name||watchAllFields.bio !== profile.data.about||watchAllFields.tag !== profile.data.tag){
            setIsBtnDisabled(false)
        }else{
            setIsBtnDisabled(true)
        }
        console.log(profile.data)
        console.log(watchAllFields)
    }, [watchAllFields.name, watchAllFields.bio, watchAllFields.tag])


    let render
    if (renderComponentName === "settings") {
        render = (
            <div className={s.settings}>
                <div className={s.settingsTop}>
                    <div className={s.settingsTopPrev} onClick={onTEST}>
                        <GrFormPreviousLink size={"30"}/>
                    </div>
                    <div className={s.settingsTopText}>
                        Настройки
                    </div>
                </div>

                <div className={s.settingsMain}>
                    <ImageUpload/>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Input type={'text'}  className={s.settings__input} placeholder={"Имя"} label={"name"}
                               register={register}/>
                        <Input type={'text'} className={s.settings__input} placeholder={"О себе"} label={"bio"}
                               register={register}/>
                        <Input type={'text'} className={s.settings__input} placeholder={"Тег"} label={"tag"}
                               register={register}/>
                        <span className={s.settingsDescription}>
                            Вы можете выбрать тег в Месседжере. Если вы это сделаете, люди смогут найти вас по
                            этому тегу и связаться с вами, не требуя вашей электронной почты.
                        </span>

                        <Button disabled={isBtnDisabled} className={s.settingsBtn}>Изменить</Button>
                    </form>
                </div>


            </div>)
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
import React from 'react';
import s from './sidebar.module.css'
import {getAuth, signOut} from "firebase/auth"
import ChatItem from "../ChatItem/ChatItem";
import {useTransition, animated} from "react-spring";
import {RiBookmarkFill} from 'react-icons/ri'
import {setCommunicationWith} from "../../../../store/slices/chatSlice";
import {useDispatch, useSelector} from "react-redux";
import {selectUid} from "../../../../store/selectors/authSelectors";
import ChatItemLoader from "../ChatItem/ChatItemLoader";
import {selectProfileImage, selectProfileState} from "../../../../store/selectors/profileSelectors";
import {GrFormPreviousLink} from "react-icons/gr";
import Input from "../../Auth/Input/Input";
import {useForm} from "react-hook-form";
import UserDataInput from "../../../../shared/interfaces/UserDataInput";
import Button from "../../../ui/Button/Button";
import usersAPI from "../../../../api/usersAPI";
import {setProfileStateImageURL} from "../../../../store/slices/profileSlice";


import default_user_image from "../../../../assets/img/default-user-image.png"


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
    const [isBtnChangePictureDisabled, setIsBtnChangePictureDisabled] = React.useState(true)
    const [userProfileImage, setUserProfileImage] = React.useState<string | null>(null)
    const [image, setImage] = React.useState<object & { file: null | Blob, dataUrl: null | string }>({
        file: null,
        dataUrl: null,
    })

    const uid = useSelector(selectUid)
    const profile = useSelector(selectProfileState)
    const profileImage = useSelector(selectProfileImage)
    const dispatch = useDispatch()

    const {register, handleSubmit, watch, setValue, formState: {errors}} = useForm<UserDataInput>();
    const watchAllFields = watch();

    const file = React.useRef<HTMLInputElement | null>(null)

    const transitionMenu = useTransition(showMenu, {
        from: {x: -300},
        enter: {x: 0},
        leave: {x: -300},
        reverse: !showMenu,
        delay: 0,
        config: {duration: 150}
    })
    const transitionSettings = useTransition(renderComponentName, {
        from: {x: -300},
        enter: {x: 0},
        leave: {x: -300},
        delay: 0,
        config: {duration: 150}
    })

    async function fetchUsers() {
        await usersAPI.fetchUserBy("name",input).then((data: any) => {
            setContacts(data)
        })
    }

    const fetchProfileImage = async () => {
        if (!uid) return
        const image = await usersAPI.fetchProfileImageByUID(uid)
        setUserProfileImage(image)
    }

    React.useEffect(() => {
        if (input.length >= 3) fetchUsers()

        if (input.length > 0) {
            setLookingForContacts(true)
        } else {
            setLookingForContacts(false)
        }
    }, [input])


    React.useEffect(() => {
        fetchProfileImage()

    }, [])


    React.useEffect(() => {
        setValue("name", profile.data.name)
        setValue("bio", profile.data.about ? profile.data.about : "")
        setValue("tag", profile.data.tag ? profile.data.tag : "")

    }, [profile.data])

    React.useEffect(() => {
        if (watchAllFields.name !== profile.data.name || watchAllFields.bio !== profile.data.about || watchAllFields.tag !== profile.data.tag) {
            setIsBtnDisabled(false)
        } else {
            setIsBtnDisabled(true)
        }
    }, [watchAllFields.name, watchAllFields.bio, watchAllFields.tag, profile.data])


    const onInputSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)

    const onShowMenuClick = () => setShowMenu(true)

    // it opens saved messages
    const onBookmarkClick = () => {
        dispatch(setCommunicationWith(uid))
        setShowMenu(false)
    }

    const onSignOutClick = () => signOut(getAuth())


    // if user clicks on the black background
    const onCloseMenuClick = (e: any) => {
        if (e.target.className === s.menu) {
            setShowMenu(false)
        }
    }

    // it opens settings(edit profile) menu
    const onSettingsClick = () => {
        setShowMenu(false)
        setRenderComponentName("settings")
    }

    const onDefaultClick = () => setRenderComponentName("default")

    const onEditProfileInformationClick = () => {
        if (!uid) return
        usersAPI.updateUserProfileData(uid, {
            uid: uid,
            name: watchAllFields.name,
            about: watchAllFields.bio,
            tag: watchAllFields.tag
        })

        setRenderComponentName("default")
    }


    const onUploadProfileImageClick = () => {
        if (!image.file || !uid) return
        usersAPI.uploadProfileImage(uid, image.file)
        dispatch(setProfileStateImageURL(image.dataUrl))
        setIsBtnChangePictureDisabled(true)
    }
    const onEditProfileImageChange = (data: any) => {
        const dataUrl = URL.createObjectURL(data.target.files[0])
        setImage({
            file: data.target.files[0],
            dataUrl
        })
        setIsBtnChangePictureDisabled(false)
    }

    const onRedirectionToInputFileClick = () => file.current?.click()



    const contactsItems = contacts.map((item: any, _) => (
        <ChatItem uid={item.uid} username={item.name} lastMessage={"Тут ничего нет"} time={""} lastSender={""}
                  picture={default_user_image}/>
    ))

    const userProfileImageOrDefault = userProfileImage ? userProfileImage : default_user_image
    const profilePicture = image?.dataUrl ? image.dataUrl : userProfileImageOrDefault



    const SettingsComponent = () => {


        return (<>
            {transitionSettings((style, item) => (
                item === "settings" && <animated.div className={s.settings} style={style}>
                    <div className={s.settingsTop}>
                        <div className={s.settingsTopPrev} onClick={onDefaultClick}>
                            <GrFormPreviousLink size={"30"}/>
                        </div>
                        <div className={s.settingsTopText}>
                            Настройки
                        </div>
                    </div>
                    <div className={s.settingsMain}>
                        <div className={s.imageUpload}>
                            <img onClick={onRedirectionToInputFileClick}
                                 src={image?.dataUrl ? image.dataUrl : profilePicture}
                                 alt=""/>
                            <Button onClick={onUploadProfileImageClick}
                                    disabled={isBtnChangePictureDisabled}>Загрузить</Button>
                            <input onChange={onEditProfileImageChange} type="file" ref={file}/>
                        </div>

                        <form onSubmit={handleSubmit(onEditProfileInformationClick)}>
                            <Input type={'text'} className={s.settings__input} placeholder={"Имя"} label={"name"}
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
                </animated.div>
            ))}
        </>)
    }
    const DefaultComponent = () => (
        <>
            <nav role="navigation" className={s.nav}>
                <div className={s.menuButton} onClick={onShowMenuClick}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <input value={input} onChange={onInputSearchChange} placeholder={"Поиск"} className={s.input}/>
            </nav>
            <div className={s.chats}>
                {!lookingForContacts ? chats.length ? chats : new Array(8).fill("_").map((item, id) =>
                    <ChatItemLoader key={id}/>) : (contactsItems.length?contactsItems:<div className={s.searchContactsInfo}>Поиск можно совершить по имени пользователя</div>)}
            </div>
        </>
    )


    return (
        <>
            {transitionMenu((style, item) => (
                item && <div className={s.menu} onClick={(e) => onCloseMenuClick(e)}>
                    <animated.ul style={style}>
                        <div className={s.profile}>
                            <div className={s.profileImg}>
                                <img
                                    src={profileImage}
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
                {renderComponentName==="default"&&<DefaultComponent/>}
                {renderComponentName==="settings"&&<SettingsComponent/>}
            </div>
        </>
    );
};

export default Sidebar;
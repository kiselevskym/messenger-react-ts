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
import {selectProfileState} from "../../../../store/selectors/profileSelectors";
import {GrFormPreviousLink} from "react-icons/gr";
import Input from "../../Auth/Input/Input";
import {useForm} from "react-hook-form";
import UserDataInput from "../../../../shared/interfaces/UserDataInput";
import Button from "../../../ui/Button/Button";
import usersAPI from "../../../../api/usersAPI";
import {fetchUserUserDataById} from "../../../../store/slices/profileSlice";

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

    async function fetchUsers() {
        await usersAPI.fetchUserByName(input).then((data: any) => {
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
        dispatch(fetchUserUserDataById(uid))
        setRenderComponentName("default")
    }


    const onUploadProfileImageClick = () => {
        if (!image.file || !uid) return
        usersAPI.uploadProfileImage(uid, image.file)
        setIsBtnChangePictureDisabled(true)
    }
    const onEditProfileImageChange = (data: any) => {
        const dataUrl = URL.createObjectURL(data.target.files[0])
        // @ts-ignore
        setImage({
            file: data.target.files[0],
            dataUrl
        })
        setIsBtnChangePictureDisabled(false)

    }
    const onRedirectionToInputFileClick = () => {
        file.current?.click()
    }


    const contactsItems = contacts.map((item: any, _) => (
        <ChatItem uid={item.uid} username={item.name} lastMessage={"Тут ничего нет"} time={""} lastSender={""}
                  picture={default_user_image}/>
    ))

    const userProfileImageOrDefault = userProfileImage ? userProfileImage : default_user_image
    const profilePicture = image?.dataUrl ? image.dataUrl : userProfileImageOrDefault

    let render
    if (renderComponentName === "settings") {
        render = (
            <div className={s.settings}>
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
                        <img onClick={onRedirectionToInputFileClick} src={profilePicture}
                             alt=""/>
                        <Button onClick={onUploadProfileImageClick} disabled={isBtnChangePictureDisabled}>Загрузить</Button>
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
            </div>)
    } else if (renderComponentName === "default") {
        render = (
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
                        <ChatItemLoader key={id}/>) : (contactsItems.length?contactsItems:<div className={s.searchContactsInfo}>Введите тег или емейл</div>)}
                </div>
            </>
        )
    }
    return (
        <>
            {transitionMenu((style, item) => (
                item && <div className={s.menu} onClick={(e) => onCloseMenuClick(e)}>
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
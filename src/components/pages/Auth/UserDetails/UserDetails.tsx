import React from 'react';
import s from '../auth.module.css'
import {useForm} from "react-hook-form";
import api from '../../../../api/usersAPI'
import AuthWrapper from "../../../ui/AuthWrapper/AuthWrapper";
import Input from "../Input/Input";
import {AuthInput} from "../../../../shared/interfaces/AuthInput";
import Button from "../../../ui/Button/Button";
import * as yup from "yup"
import {yupResolver} from "@hookform/resolvers/yup";
import { doc, getFirestore, getDoc} from "firebase/firestore";
import {useSelector} from "react-redux";
import {selectIsAuth, selectUid} from "../../../../store/selectors/authSelectors";
import {useHistory} from "react-router-dom";
const scheme = yup.object().shape({
    name: yup.string().required().min(3),
    about: yup.string()
})

const UserDetails = () => {
    const history = useHistory()
    const uid = useSelector(selectUid)
    const isUserAuth = useSelector(selectIsAuth)
    const {register, handleSubmit, formState: {errors}} = useForm<AuthInput>({
        resolver: yupResolver(scheme)
    })



    const onSubmitClick = (data: AuthInput) => {
        api.addUserProfileData(uid, {name: data.name}).then(()=>{
            console.log('added')
        })
    }


    async function getUser(uid: string|undefined) {
        if(uid===undefined) return
        const docRef = doc(getFirestore(), "users", uid);
        const docSnap = await getDoc(docRef);


        if (!docSnap.exists() && isUserAuth !== null) {
            history.push('/details')
        }else {
            history.push('/')
        }

    }
    getUser(uid)
    return (
        <AuthWrapper title={"Дополнительная информация"} subtitle={"Укажите дополнительную информацию о себе чтобы продолжить."}>
            <form onSubmit={handleSubmit(onSubmitClick)}>
                <Input className={s.root__input} label={"name"} placeholder={"Ваше имя"} register={register}/>
                <Input className={s.root__input} label={"about"} placeholder={"О себе"} register={register}/>
                <Button className={s.root__button}>
                    Зарегестрироваться
                </Button>
                <p>{errors.name?.message}</p>
                <p>{errors.about?.message}</p>
            </form>
        </AuthWrapper>
    );
};

export default UserDetails;
import React from 'react';
import AuthWrapper from "../../../ui/AuthWrapper/AuthWrapper";
import Input from "../Input/Input";
import {useForm} from "react-hook-form";
import {AuthInput} from "../../../../shared/interfaces/AuthInput";
import s from '../auth.module.css'
import Button from "../../../ui/Button/Button";
import {useHistory} from "react-router-dom";
import * as yup from "yup"
import {emailText, minText, reqText} from "../validateText";
import {yupResolver} from "@hookform/resolvers/yup";
import {signInWithEmailAndPassword} from "firebase/auth"
import auth from "../../../../firebase/firebase";
import {useSelector} from "react-redux";
import {selectAuth} from "../../../../store/store";

const scheme = yup.object().shape({
    email: yup.string().required(reqText).email(emailText).trim(),
    password: yup.string().required(reqText).min(8, minText).trim(),
})

const Login = () => {
    const history = useHistory()


    const {register, handleSubmit, formState: {errors}} = useForm<AuthInput>({
        resolver: yupResolver(scheme)
    })
    const onSubmit = (data: AuthInput) => {
        signInWithEmailAndPassword(auth, data.email, data.password).then(() => {
            console.log("sign in")
        }).catch(() => {
            alert("error")
        })
    }
    const onLinkClick = () => {
        history.push("/register")
    }

    return (
        <AuthWrapper title={"Войти в мессенжер"} subtitle={"Введите электронную почту и пароль"}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Input className={s.root__input} placeholder={"Введите электронную почту"} label={"email"}
                       register={register}/>
                <Input className={s.root__input} placeholder={"Введите свой пароль"} label={"password"}
                       register={register}/>
                <Button className={s.root__button}>
                    Войти
                </Button>
                <div className={s.link} onClick={onLinkClick}>
                    или зарегестрироваться
                </div>
                <p>{errors.email?.message}</p>
                <p>{errors.password?.message}</p>
            </form>
        </AuthWrapper>
    );
};

export default Login;
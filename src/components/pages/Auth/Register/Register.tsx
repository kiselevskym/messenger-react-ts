import React from 'react';
import {useForm, SubmitHandler} from "react-hook-form";
import {AuthInput} from "../../../../shared/interfaces/AuthInput";
import Input from "../Input/Input";
import AuthWrapper from "../../../ui/AuthWrapper/AuthWrapper";
import s from '../auth.module.css'
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from "yup";
import Button from "../../../ui/Button/Button";
import {useHistory} from "react-router-dom";
import {emailText, minText, reqText} from "../validateText";
import {createUserWithEmailAndPassword} from 'firebase/auth'
import auth from "../../../../firebase/firebase";


const schema = yup.object().shape({
    email: yup.string().required(reqText).email(emailText).trim(),
    password: yup.string().required(reqText).min(8, minText).trim(),
    confirmPassword: yup.string().required(reqText).min(8, minText).trim(),
});

const Register = () => {
    const history = useHistory()
    const {register, handleSubmit, formState: {errors}} = useForm<AuthInput>({resolver: yupResolver(schema)})
    const onSubmit: SubmitHandler<AuthInput> = data => {
        if(data.password===data.confirmPassword){
            createUserWithEmailAndPassword(auth, data.email, data.password).then(()=>{
                history.push("/details")
            }).catch((error)=>{
                console.log(error)
            })
        }
    }

    const onLinkClick = () => {
        history.push("/login")
    }

    return (
        <AuthWrapper title={"Зарегеструйтесь"}
                     subtitle={"Введите свою электронную почту, пароль, а так же подвердите его"}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Input className={s.root__input} placeholder={"Введите электронную почту"} label={"email"} register={register}/>
                <Input className={s.root__input} placeholder={"Введите пароль"} label={"password"} register={register}/>
                <Input className={s.root__input} placeholder={"Подверлите пароль"} register={register}
                       label={"confirmPassword"}/>
                <Button className={s.root__button}>
                    Продолжить
                </Button>
                <div className={s.link} onClick={onLinkClick}>
                    или войти
                </div>
                <p>{errors.email?.message}</p>
                <p>{errors.password?.message}</p>
                <p>{errors.confirmPassword?.message}</p>
            </form>

        </AuthWrapper>
    );
};

export default Register;
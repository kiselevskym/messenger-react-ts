import React from 'react';
import s from './auth-wrapper.module.css';
import logo from '../../../assets/img/messenger_logo.svg'


interface AuthWrapperProps {
    children: JSX.Element[] | JSX.Element
    title: string
    subtitle: string
}

const AuthWrapper = ({children, title, subtitle}: AuthWrapperProps) => {
    return (
        <div className={s.root}>
            <div className={s.main}>
                <div className={s.img}>
                    <img src={logo} alt="logo"/>
                </div>
                <div className={s.info}>
                    <div className={s.title}>{title}</div>
                    <div className={s.subtitle}>{subtitle}</div>
                </div>
                <div>
                    <div className={s.root}>
                        {children}
                    </div>
                </div>
            </div>
        </div>

    );
};

export default AuthWrapper;
import React from 'react';
import s from './main-content.module.css'
import TopInformation from "../TopInformation/TopInformation";
import MessageItem from "../MessageItem/MessageItem";

const MainContent = () => {
    return (
        <div className={s.root}>
            <TopInformation/>
            <div className={s.messages}>
                <MessageItem message={"Сервис онлайн проверки текста на уникальность Text.ru покажет процент уникальности текста. Глубокая и качественная проверка найдет дубликаты и рерайт."} my={true}/>
                <MessageItem message={"Привет"}/>
                <MessageItem message={"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"}/>
                <MessageItem message={"Привет"}/>
                <MessageItem message={"Привет"}/>
                <MessageItem message={"Привет"}/>
                <MessageItem message={"Привет"}/>
                <MessageItem message={"Привет"}/>
                <MessageItem message={"Привет"}/>
                <MessageItem message={"Привет"}/>
                <MessageItem message={"Привет"}/>
                <MessageItem message={"Привет"}/>
                <MessageItem message={"Привет"}/>
                <MessageItem message={"Привет"}/>
                <MessageItem message={"Привет"}/>
                <MessageItem message={"Привет"}/>
                <MessageItem message={"Привет"}/>
                <MessageItem message={"Привет"}/>
                <MessageItem message={"Привет"}/>
                <MessageItem message={"Привет"}/>
            </div>
        </div>
    );
};

export default MainContent;
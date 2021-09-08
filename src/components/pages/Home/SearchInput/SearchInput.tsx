import React from 'react';
import s from './search-input.module.css'

const SearchInput = () => {
    return (
        <input className={s.root} placeholder={"Поиск контактов"}/>
    );
};

export default SearchInput;
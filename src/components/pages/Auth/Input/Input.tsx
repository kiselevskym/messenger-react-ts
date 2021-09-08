import React from 'react';
import {Path, UseFormRegister} from "react-hook-form";

import s from "./input.module.css"
import {AuthInput} from "../../../../shared/interfaces/AuthInput";


type InputProps = {
    label: Path<AuthInput>;
    register: UseFormRegister<AuthInput>;
    className?: string;
    placeholder?: string
    type?: string | 'text'
};

const Input = ({label, register, className, placeholder, type}: InputProps) => (
    <input type={type} className={s.root + " " + className} placeholder={placeholder} {...register(label)} />
);

export default Input;
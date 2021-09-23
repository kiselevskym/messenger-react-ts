import React from 'react';
import s from './button.module.css';

type ButtonProps = {
    children: string
    className?: string
    disabled?: boolean
    onClick?: ()=>void
}

const Button = ({children, className, disabled, onClick}: ButtonProps) => {
    return (
        <button disabled={disabled} className={s.root+" "+className+" "+(disabled?s.disabled:"")} onClick={onClick}>
            {children}
        </button>
    );
};

export default Button;
import React from 'react';
import s from './button.module.css';

type ButtonProps = {
    children: string
    className?: string
    disabled?: boolean
}

const Button = ({children, className, disabled}: ButtonProps) => {
    return (
        <button className={s.root+" "+className+" "+(disabled?s.disabled:"")}>
            {children}
        </button>
    );
};

export default Button;
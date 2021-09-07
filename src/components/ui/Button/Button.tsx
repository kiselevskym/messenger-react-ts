import React from 'react';
import s from './button.module.css';

type ButtonProps = {
    children: string
    className?: string
}

const Button = ({children, className}: ButtonProps) => {
    return (
        <button className={s.root+" "+className}>
            {children}
        </button>
    );
};

export default Button;
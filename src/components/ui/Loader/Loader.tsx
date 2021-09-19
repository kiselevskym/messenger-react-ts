import React from 'react';
import s from "./loader.module.css"

const Loader = () => {
    return (
        <div className={s.root}>
            <div className={s.ldsDualRing}></div>
        </div>
    );
};

export default Loader;
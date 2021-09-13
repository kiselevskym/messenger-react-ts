import React, {useEffect} from 'react';
import './modal-window.css'
import ReactDOM from "react-dom";

interface ModalProps {
    children: JSX.Element | JSX.Element[]
    show: boolean,
    setShow: (is: boolean) => void
}


const modalRoot = document.getElementById('modal');
const ModalWindow = ({children, show, setShow}: ModalProps) => {

    const modalRef = React.useRef(null)
    const backgroundRef = React.useRef(null)


    const onCloseClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if(e.target === backgroundRef.current){
            setShow(false)
        }
    }

    if(!show) return <></>
    return (
        <div className={"mutedback"} onClick={onCloseClick} ref={backgroundRef}>
            <div className={"modal"} ref={modalRef}>
                {children}
            </div>
        </div>
    );
};

export default ModalWindow;
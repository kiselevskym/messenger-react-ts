import React, {useEffect} from 'react';
import './modal-window.css'
import ReactDOM from "react-dom";

interface ModalProps {
    children: JSX.Element | JSX.Element[]
}


const modalRoot = document.getElementById('modal');
const ModalWindow = ({children}: ModalProps) => {
    const [showModal, setShowModal] = React.useState(true)
    const modalRef = React.useRef(null)
    const div = document.createElement('div')
    useEffect(() => {
        modalRoot!.appendChild(div)
    })

    const onCloseClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if(e.target !== modalRef.current){
            setShowModal(false)
        }
    }
    if(!showModal) return <div></div>
    return ReactDOM.createPortal(
        <div className={"mutedback"} onClick={onCloseClick}>
            <div className={"modal"} ref={modalRef}>
                {children}
            </div>
        </div>,
        div
    );
};

export default ModalWindow;
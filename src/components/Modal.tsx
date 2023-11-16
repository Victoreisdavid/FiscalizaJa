import style from "../styles/modal.module.scss";
import { useEffect } from "react";

export default function Modal({ isOpen, onClose, children }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.querySelector<HTMLElement>("#site-container").style.filter = "blur(5px)"
        } else {
            document.body.style.overflow = 'auto';
            document.querySelector<HTMLElement>("#site-container").style.filter = "none"
        }
     
        return () => {
            document.body.style.overflow = 'auto';
        };
      }, [isOpen]);
    
    if (!isOpen) {
        return null;
    }

    return (
        <div className={style.modal}>
            <div className={style.modal_content}>
                {children}
                <button onClick={onClose} className={style.modal_button}>Fechar</button>
            </div>
      </div>
    );
};
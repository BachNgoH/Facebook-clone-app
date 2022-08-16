import React, { Fragment } from "react";
import classes from "./Modal.module.css";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
const Backdrop = (props) => {
    return <div className={classes.backdrop} onClick={props.onClose}></div>;
};

const ModalOverlay = (props) => {
    return (
        <div className={classes.modal} >
            <div className={classes.closemark} onClick={props.onClose}>

            <FontAwesomeIcon icon={faXmark} />
            </div>
            <div className={classes.content}>{props.children}</div>
        </div>
    );
};

const portalElement = document.getElementById("overlay");

const Modal = (props) => {
    return (
        <Fragment>
            {ReactDOM.createPortal(
                <Backdrop onClose={props.onClose} />,
                portalElement
            )}
            {ReactDOM.createPortal(
                <ModalOverlay onClose={props.onClose}>{props.children}</ModalOverlay>,
                portalElement
            )}
        </Fragment>
    );
};

export default Modal;

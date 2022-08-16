import React, { useRef } from "react";
import Button from "../ui/Button";
import classes from "./ProfilePartAdd.module.css";

function ProfilePartAdd(props) {

    const inputRef = useRef(null)
    const onButtonClick = () => {
        inputRef.current.click()
    }

    return (
        <div className={classes.main}>
            <div>{props.name}</div>
            {props.type === "image" ? (
                <Button className={classes.btn} type="button" onClick={onButtonClick}>
                    <input type="file" style={{display: 'none'}} onChange={props.onChange} ref={inputRef} accept="image/*" 
                    id={props.id}/> EDIT
                </Button>
            ) : (
                <Button className={classes.btn} type="button" onClick={props.onClick}>
                    {props.showbio && "EDIT"}
                    {!props.showbio && "SAVE"}
                </Button>
            )}
        </div>
    );
}

export default ProfilePartAdd;

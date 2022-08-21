import React from "react";
import Card from "../ui/Card";
import classes from "./Typing.module.css";

const Typing = () => {
    return (
        <div id={classes["wave"]}>
            <span class={`${classes.dot} ${classes.one}`}></span>
            <span class={`${classes.dot} ${classes.two}`}></span>
            <span class={`${classes.dot} ${classes.three}`}></span>

        </div>
    );
};

export default Typing;

import React from "react";
import Card from "../ui/Card";
import classes from "./Typing.module.css";

const Typing = () => {
    return (
        <div id={classes["wave"]}>
            <span className={`${classes.dot} ${classes.one}`}></span>
            <span className={`${classes.dot} ${classes.two}`}></span>
            <span className={`${classes.dot} ${classes.three}`}></span>

        </div>
    );
};

export default Typing;

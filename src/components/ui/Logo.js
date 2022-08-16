import React from "react";
import Card from "./Card";
import classes from "./Logo.module.css"

function Logo(props) {
    return <Card className={`${classes.logo} ${props.className}`} onClick={props.onClick}>FBC</Card>;
}

export default Logo;

import React from "react";
import classes from "./Card.module.css";

const Card = React.forwardRef((props, ref) => {
    return (
        <div className={`${classes.card} ${props.className}`} style={props.style} ref={ref} onClick={props.onClick}>
            {props.children}
        </div>
    );
});

export default Card;

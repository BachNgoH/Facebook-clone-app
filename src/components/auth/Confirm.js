import React from "react";
import classes from './Form.module.css'

const Confirm = () => {
    return (
        <div>
            <h1>Confirm</h1>
            <div className={classes.confirm}>
                <h2>Almost done! - Please confirm your email address</h2>
                <p>Check your inbox for an email</p>
            </div>
        </div>
    );
};

export default Confirm;

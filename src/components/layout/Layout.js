import React from "react";
import MainNavigation from "./MainNavigation";
import classes from './Layout.module.css'

function Layout(props) {
    return (
        <div className={classes.layout}>
            <MainNavigation />
            {props.children}
        </div>
    );
}

export default Layout;

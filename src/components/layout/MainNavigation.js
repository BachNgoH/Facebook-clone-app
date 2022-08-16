import React from "react";
import Logo from "../ui/Logo";
import { useHistory } from "react-router-dom";
import classes from "./MainNavigation.module.css";
import SearchBar from "../nav/SearchBar";
import Avatar from "../nav/Avatar";

const MainNavigation = () => {
    const history = useHistory();
    const navigateToMainPageHandler = () => {
        history.push("/");
    };

    return (
        <div className={classes.nav}>
            <div className={classes.navBox}>
                <Logo
                    className={classes.logo}
                    onClick={navigateToMainPageHandler}>
                    FBC
                </Logo>
            </div>
            <div className={classes.navBox}>
                <SearchBar />
            </div>
            <div className={classes.navBox}>
                <Avatar />
            </div>
        </div>
    );
};

export default MainNavigation;